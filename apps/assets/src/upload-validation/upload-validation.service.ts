import { Inject, Injectable, Logger } from '@nestjs/common';
import { MinioEventRecord, UploadedFileData, UploadedFileEventData } from './interfaces.js';
import { DatabaseService } from '../database/database.service.js';
import { StorageClient } from '../storage/storage-client.js';
import { fileTypeFromBuffer } from 'file-type';
import { ClientProxy } from '@nestjs/microservices';
import { UploadedFileEventDto } from './dto/uploaded-file-event.dto.js';

@Injectable()
export class UploadValidationService {
    private readonly logger = new Logger(UploadValidationService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly storageClient: StorageClient,
        @Inject('KNOWLEDGE_BASE_SERVICE') private readonly knowledgeBase: ClientProxy
    ) {}

    async handleUploadedFile(msg: UploadedFileEventDto) {
        const records = msg.Records || [];
        for (const record of records) {
            const data = this.mapEventData(record);
            await this.validateUploadedFile(data);
        }
    }

    private async validateUploadedFile(data: UploadedFileData) {
        const { objectName, size, originalName, userId } = data;
        if (!userId || !originalName) {
            await this.storageClient.removeObject(objectName);
            this.logger.warn(`Rejected ${objectName}: Metadata is missing`);
            return;
        }
        const buffer = await this.readFirstBytes(objectName, 4100);
        const mimeType = await this.validateFileType(buffer);
        if (!mimeType) {
            await this.storageClient.removeObject(objectName);
            this.logger.warn(`Rejected ${objectName}: Unsupported file type`);
            return;
        }
        const asset = await this.databaseService.saveAsset({
            assetName: objectName,
            originalName,
            size,
            mimeType,
            userId,
        });

        this.knowledgeBase.emit<any, UploadedFileEventData>('file.uploaded', {
            objectName,
            mimeType,
            userId,
            assetId: asset.id!,
        });

        this.logger.debug(`Approved ${objectName}: File Saved`);
    }

    private mapEventData(record: MinioEventRecord): UploadedFileData {
        const { key, size, userMetadata } = record.s3.object;
        const objectName = decodeURIComponent(key.replace(/\+/g, ' '));
        let userId: string | undefined;
        let originalName: string | undefined;

        if (userMetadata) {
            const normalizedMeta = Object.keys(userMetadata).reduce<Record<string, string>>(
                (acc, k) => {
                    const val = userMetadata[k];
                    if (val !== undefined) {
                        acc[k.toLowerCase()] = String(val);
                    }
                    return acc;
                },
                {}
            );

            userId = normalizedMeta['x-amz-meta-uploadedby'] ?? normalizedMeta['uploadedby'];
            originalName =
                normalizedMeta['x-amz-meta-originalname'] ?? normalizedMeta['originalname'];
        }

        return { objectName, size, originalName, userId };
    }

    private async readFirstBytes(objectName: string, limit: number): Promise<Buffer> {
        const stream = await this.storageClient.getObject(objectName);
        const chunks: Buffer[] = [];
        let total = 0;
        try {
            for await (const chunk of stream) {
                const buf: Buffer = Buffer.isBuffer(chunk)
                    ? chunk
                    : Buffer.from(chunk as Uint8Array);
                chunks.push(buf);
                total += buf.length;
                if (total >= limit) {
                    stream.destroy();
                    break;
                }
            }
        } catch {
            // Ignore expected stream destruction / premature close
        }
        return Buffer.concat(chunks).subarray(0, limit);
    }

    private async validateFileType(buffer: Buffer): Promise<string | undefined> {
        if (buffer.length === 0) return undefined;
        const detected = await fileTypeFromBuffer(buffer);
        if (detected) {
            if (detected.mime === 'application/pdf' || detected.mime === 'text/plain') {
                return detected.mime;
            }
            return undefined;
        }
        // Fallback for plain text files (e.g. txt, csv, md) which lack binary magic headers
        if (this.isValidUtf8Text(buffer)) {
            return 'text/plain';
        }
        return undefined;
    }

    private isValidUtf8Text(buffer: Buffer): boolean {
        return !buffer.toString('utf8').includes('\x00');
    }
}

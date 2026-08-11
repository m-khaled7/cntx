import { Injectable, Logger } from '@nestjs/common';
import { MinioEvent, MinioEventRecord, UploadedFileData } from './interfaces.js';
import { DatabaseService } from '../database/database.service.js';
import { StorageClient } from '../storage/storage-client.js';
import { fileTypeFromBuffer } from 'file-type';

@Injectable()
export class UploadValidationService {
    private readonly logger = new Logger(UploadValidationService.name);
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly storageClient: StorageClient
    ) {}
    async handleUploadedFile(msg: MinioEvent) {
        const records = msg.Records || [];
        for (const record of records) {
            const data=this.mapEventData(record)
            await this.validateUploadedFile(data);
        }
    }

    private async validateUploadedFile(data: UploadedFileData) {
        const {objectName,size,originalName,userId}=data
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
        await this.databaseService.saveAssit({
            assetName: objectName,
            originalName,
            size,
            mimeType,
            userId,
        });

        this.logger.debug(`Approved ${objectName}: File Saved`);
    }

    private mapEventData(record: MinioEventRecord): UploadedFileData {
        const { key, size, userMetadata } = record.s3.object;
        const objectName = decodeURIComponent(key.replace(/\+/g, ' '));
        const userId = userMetadata?.['X-Amz-Meta-Uploadedby'];
        const originalName = userMetadata?.['X-Amz-Meta-Originalname'];
        return { objectName, size, originalName, userId };
    }

    private async readFirstBytes(objectName: string, limit: number): Promise<Buffer> {
        const stream = await this.storageClient.getObject(objectName);
        const chunks: Buffer[] = [];
        let total = 0;
        for await (const chunk of stream) {
            chunks.push(chunk);
            total += chunk.length;
            if (total >= limit) {
                stream.destroy();
                break;
            }
        }
        return Buffer.concat(chunks);
    }

    private async validateFileType(buffer: Buffer): Promise<string | undefined> {
        const detected = await fileTypeFromBuffer(buffer);
        if (!detected) return undefined;
        if (detected.mime === 'text/plain') {
            if (!this.isValidUtf8Text(buffer)) return undefined;
            return detected.mime;
        }
        if (detected.mime === 'application/pdf') {
            return detected.mime;
        }
        return undefined;
    }

    private isValidUtf8Text(buffer: Buffer): boolean {
        return !buffer.toString('utf8').includes('\x00');
    }
}

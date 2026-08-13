import { Injectable, Logger } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PDFParse } from 'pdf-parse';
import { DenseModel } from '../AI/base/dense.model.js';
import { DataStoreService } from '../data-store/data-store.service.js';
import { StorageClient } from '../storage/storage-client.js';
import { StoreChunkInput } from '../data-store/data-store.interfaces.js';
import { UploadedFileEventDto } from './dto/uploaded-file-event.dto.js';

@Injectable()
export class ProcessService {
    private readonly logger = new Logger(ProcessService.name);
    constructor(
        private readonly storageClient: StorageClient,
        private readonly denseModel: DenseModel,
        private readonly dataStore: DataStoreService
    ) {}
    async processFile(msg: UploadedFileEventDto) {
        const { objectName, mimeType, userId, assetId } = msg;
        const objectBuffer = await this.storageClient.getObject(objectName);
        let chunks: string[] | undefined;
        if (mimeType === 'text/plain') {
            const fileContent = objectBuffer.toString('utf-8');
            chunks = await this.createChunks([fileContent]);
        } else if (mimeType === 'application/pdf') {
            chunks = await this.chunkPDF(objectBuffer);
        } else {
            this.logger.warn(`Processing File ${assetId} failed: Unsupported file type`);
            return;
        }
        if (!chunks) {
            this.logger.warn(`Processing File ${assetId} failed: No chunks generated`);
            return;
        }
        const embeddings = await this.denseModel.generateDenseVectors(chunks);
        if (!embeddings) {
            this.logger.warn(`Processing File ${assetId} failed: No embedding generated`);
            return;
        }
        const chunksData: StoreChunkInput[] = chunks.map((chunk, index) => ({
            content: chunk,
            embedding: embeddings[index]!,
            chunkIndex: index,
            userId,
            assetId,
        }));
        await this.dataStore.saveChunks(chunksData);
        this.logger.debug(`Processing File ${assetId} succeeded`);
    }

    private async chunkPDF(objectBuffer: Buffer): Promise<string[]> {
        const parser = new PDFParse({ data: objectBuffer });
        const fileContent = await parser.getText();
        const pagesText = fileContent.pages.map((page) => page.text);
        return this.createChunks(pagesText);
    }

    private async createChunks(text: string[]): Promise<string[]> {
        const spliter = new RecursiveCharacterTextSplitter({
            chunkSize: 600,
            chunkOverlap: 120,
        });

        const chunks = (await spliter.createDocuments(text)).map((doc) => doc.pageContent);
        return chunks;
    }
}

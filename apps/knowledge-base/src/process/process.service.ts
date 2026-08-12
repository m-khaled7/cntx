import { Injectable } from "@nestjs/common";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PDFParse } from 'pdf-parse';
import { DenseModel } from "../AI/base/dense.model.js";
import { DataStoreService } from "../data-store/data-store.service.js";
import { StorageClient } from "../storage/storage-client.js";
import { StoreChunkInput } from "../data-store/data-store.interfaces.js";
import { UploadedFileData } from "./process.interfaces.js";

@Injectable()
export class ProcessService {
    constructor(private readonly storageClient: StorageClient,
        private readonly denseModel:DenseModel,
        private readonly dataStore:DataStoreService,

    ) {}
    async processFile(msg: UploadedFileData) {
        const { objectName, mimeType, userId,assetId } = msg;
        const objectBuffer = await this.storageClient.getObject("documents", objectName);

        let chunks: string[] | undefined;
        if (mimeType === "text/plain") {
            const fileContent = objectBuffer.toString("utf-8");
            chunks = await this.createChunks([fileContent]);
        } else if (mimeType === "application/pdf") {
            chunks = await this.chunkPDF(objectBuffer);
        } else {
            return;
        }
        if (!chunks) return;
        const embeddings= await this.denseModel.generateDenseVectors(chunks)
        if(!embeddings)return
        
        const chunksData:StoreChunkInput[]=chunks.map((chunk,index)=>({
           content:chunk,
           embedding:embeddings[index]!,
           chunkIndex:index,
           userId,
           assetId
        }))

        await this.dataStore.saveChunks(chunksData)

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

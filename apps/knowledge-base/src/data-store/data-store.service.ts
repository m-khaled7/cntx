import { Injectable, Inject } from "@nestjs/common";
import { StoreChunkInput } from "./data-store.interfaces.js";
import { ChunkEntity } from "./entities/chunk.entity.js";
import { ChunksRepository } from "./repositories/chunks.repository.js";

// data-store.service.ts
export const DATA_STORE_PROVIDER = Symbol('DATA_STORE_PROVIDER');

@Injectable()
export class DataStoreService {
    constructor(private readonly chunksRepository:ChunksRepository) {}

    async saveChunks(chunks:StoreChunkInput[]){
        const chunkEntities=chunks.map(chunk=>this.toEntity(chunk))
        await this.chunksRepository.insertManyInBatches(chunkEntities)
    }

    retriveChunks(query:string,embedding:number[],userId:string,poolSize:number,topK:number){
        return this.chunksRepository.hybridSearch(userId,embedding,query,poolSize=20,topK=5)
    }

    private toEntity(chunk:StoreChunkInput):ChunkEntity{
        return this.chunksRepository.createEntity({
            content:chunk.content,
            embedding:chunk.embedding,
            chunkIndex:chunk.chunkIndex,
            userId:chunk.userId,
            assetId:chunk.assetId,
            metadata:chunk.metadata
        })
    }

}

import { Injectable, Inject } from "@nestjs/common";
import { SearchInput, SearchResult, StoreChunkInput } from "./data-store.interfaces.js";
import { ChunkEntity } from "./entities/chunk.entity.js";
import { ChunksRepository } from "./repositories/chunks.repository.js";

// data-store.service.ts
export const DATA_STORE_PROVIDER = Symbol('DATA_STORE_PROVIDER');

@Injectable()
export class DataStoreService {
    constructor(private readonly chunksRepository:ChunksRepository) {}

    async storeChunks(chunks:StoreChunkInput[]){
        const chunkEntities=chunks.map(chunk=>this.toEntity(chunk))
        await this.chunksRepository.insertManyInBatches(chunkEntities)
    }

   async searchChunks(input:SearchInput):Promise<SearchResult[]>{
        const {userId,queryText,queryEmbedding,topK=10}=input
        const poolSize=50
        const result=await this.chunksRepository.hybridSearch(userId,queryEmbedding,queryText,poolSize,topK)
        return result.map((result):SearchResult=>({
            id:result.id,
            content:result.content,
            metadata:result.metadata??{},
            score:result.rrf_score
        }))
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

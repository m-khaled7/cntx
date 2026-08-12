import { Injectable, Inject } from "@nestjs/common";
import { StoreChunkInput, SearchInput, RankedResult } from "./data-store.interfaces.js";
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

    

    private rrf(resultSets: RankedResult[][], topK: number, k = 60): RankedResult[] {
        const merged = new Map<string, { result: RankedResult; score: number }>();
        for (const set of resultSets) {
            set.forEach((result, rank) => {
                const contribution = 1 / (k + rank + 1);
                const existing = merged.get(result.id);
                existing
                    ? (existing.score += contribution)
                    : merged.set(result.id, { result, score: contribution });
            });
        }
        return [...merged.values()]
            .sort((a, b) => b.score - a.score)
            .slice(0, topK)
            .map(({ result, score }) => ({ ...result, score }));
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

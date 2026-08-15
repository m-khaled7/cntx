import { ConfigService } from '@nestjs/config';
import { CohereClientV2 } from 'cohere-ai';
import { RerankerConfig } from '../../config/configs/reranker.config.js';
import { RerankerModel } from '../base/reranker.model.js';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CohereProvider implements RerankerModel {
    private client: CohereClientV2;
    private config: RerankerConfig;
    constructor(private readonly configService: ConfigService) {
        this.config = this.configService.getOrThrow<RerankerConfig>('rerankerConfig');
    }
    getClient() {
        if (!this.client) {
            this.client = new CohereClientV2({ token: this.config.apiKey });
        }
        return this.client;
    }

    async rerankChunks(
        query: string,
        chunks: string[],
        topN?: number
    ) {
        if (!chunks || chunks.length === 0) return [];
        const client = this.getClient();
        const response = await client.rerank({
            model: this.config.model,
            query,
            documents: chunks,
            topN: topN ?? chunks.length,
        });

        return response.results.map((r) => ({
            text: chunks[r.index]!,
            relevanceScore: r.relevanceScore,
            index: r.index,
        }));
    }

    /**
     * Rerank and keep only chunks above a relevance score threshold.
     */
    async filterByThreshold(
        query: string,
        chunks: string[],
        threshold = 0.5
    ) {
        const results = await this.rerankChunks(query, chunks);
        return results.filter((r) => r.relevanceScore >= threshold);
    }
}

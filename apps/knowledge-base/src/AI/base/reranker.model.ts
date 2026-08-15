export interface relevantChunk {
    text: string;
    relevanceScore: number;
    index: number;
    metadata?: Record<string,unknown>;
}

export abstract class RerankerModel {
    abstract rerankChunks(
        query: string,
        chunks: string[],
        topN?: number,
    ): Promise<relevantChunk[]>;
    abstract filterByThreshold(query: string, chunks: string[], threshold:number):Promise<relevantChunk[]>
}

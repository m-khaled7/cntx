export interface StoreChunkInput {
    content: string;
    embedding: number[];
    userId: string;
    assetId: string;
    chunkIndex: number;
    metadata?: Record<string, unknown>;
}

export interface SearchInput {
    userId: string;
    queryText: string;
    queryEmbedding: number[];
    topK?: number;
}

export interface RankedResult {
    id: string;
    content: string;
    metadata: Record<string, unknown>;
    score: number;
}

export interface HybridSearchResult {
    id: string;
    content: string;
    metadata: Record<string, unknown> | null;
    rrf_score: number;
}
import { registerAs } from "@nestjs/config";

export interface RerankerConfig{
    apiKey:string,
    model:string,
    topN:number
}

export default registerAs('rerankerConfig', (): RerankerConfig => ({
    apiKey: process.env.COHERE_API!,
    model: process.env.RERANKER_MODEL ?? 'rerank-v3.5',
    topN: 5,
}));
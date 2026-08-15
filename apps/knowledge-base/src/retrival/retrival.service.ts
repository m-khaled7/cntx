import { Injectable, Logger } from "@nestjs/common";
import { DataStoreService } from "../data-store/data-store.service.js";
import { DenseModel } from "../AI/base/dense.model.js";
import { RerankerModel } from "../AI/base/reranker.model.js";
import { RpcError } from "@cntx/common";
import { status } from "@grpc/grpc-js";
import { GetRelevantChunks } from "./dto/get-relevant-chunks.dto.js";

@Injectable()
export class RetrivalService {
    private readonly logger = new Logger(RetrivalService.name);
    constructor(
        private readonly dataStoreService: DataStoreService,
        private readonly denseModel: DenseModel,
        private readonly rerankerModel: RerankerModel
    ) {}

    async getRelevantChunks(dto: GetRelevantChunks, userId: string) {
        const {query:queryText}=dto
        const queryEmbedding = await this.denseModel.generateDenseVectors([queryText])[0];
        if (!queryEmbedding) {
            this.logger.warn('generate embeddings failed');
            throw new RpcError(status.INTERNAL, 'internal server error');
        }
        const candidatedChunks = await this.dataStoreService.searchChunks({
            queryText,
            queryEmbedding,
            userId,
        });
        const chunks = candidatedChunks.map((result) => result.content);
        return await this.rerankerModel.rerankChunks(queryText, chunks);
    }
}
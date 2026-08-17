import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { RpcException, type ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';

import {
    RelevantChunksResponse,
    RetrivalServiceClient,
    RetrivalServiceService,
} from '../common/generated-proto/knowledge-base.js';
import { QueryDto } from './dto/query.dto.js';
import { LLMModel } from '../llm/llm.model.js';
import { documetPrompt, footerPrompt, sysPrompt } from '../templates/prompts/default.prompt.js';

const KNOWLEDGE_BASE_CLIENT = 'KNOWLEDGEBASE';
const USER_ID_HEADER = 'X-User-Id';

interface QueryResult {
    answer: string;
}

@Injectable()
export class QueryService {
    private readonly logger = new Logger(QueryService.name);
    private retrievalService!: RetrivalServiceClient;

    constructor(
        @Inject(KNOWLEDGE_BASE_CLIENT) private readonly knowledgeBase: ClientGrpc,
        private readonly llmModel: LLMModel
    ) {}

    onModuleInit() {
        // Resolve once instead of on every request
        this.retrievalService = this.knowledgeBase.getService<RetrivalServiceClient>(
            'RetrivalService'
        );
    }

    async query(dto: QueryDto, userId: string) {
        const relevantChunks = await this.getRelevantChunks(dto.query, userId);

        if (!relevantChunks?.chunks?.length) {
            throw new InternalServerErrorException('No relevant chunks found for the given query');
        }

        const fullPrompt = this.buildPrompt(dto.query, relevantChunks);
        const answer = await this.llmModel.generateText(sysPrompt, fullPrompt);
        if(!answer){
            throw new RpcException('no answer')
        }
        return { answer };
    }

    private async getRelevantChunks(
        query: string,
        userId: string
    ): Promise<RelevantChunksResponse> {
        const metadata = new Metadata();
        metadata.add(USER_ID_HEADER, userId);

        try {
            return await firstValueFrom(
                this.retrievalService.getRelevantChunks({ query }, metadata)
            );
        } catch (error) {
            this.logger.error(
                `Failed to fetch relevant chunks for query "${query}"`,
                error as Error
            );
            throw new InternalServerErrorException('Failed to retrieve relevant chunks');
        }
    }

    private buildPrompt(query: string, relevantChunks: RelevantChunksResponse): string {
        const documentsPrompt = relevantChunks.chunks
            .map((chunk, index) => documetPrompt(index, chunk.relevanceScore, chunk.text))
            .join('\n');

        return [documentsPrompt, footerPrompt(query)].join('\n');
    }
}

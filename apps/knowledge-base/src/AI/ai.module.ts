import { Module } from '@nestjs/common';
import { DenseModel } from './base/dense.model.js';
import { GoogleProvider } from './providers/google.provider.js';
import { RerankerModel } from './base/reranker.model.js';
import { CohereProvider } from './providers/cohere.provider.js';

@Module({
    providers: [
        {
            provide: DenseModel,
            useClass: GoogleProvider,
        },
        { provide: RerankerModel, useClass: CohereProvider },
    ],
    exports: [DenseModel, RerankerModel],
})
export class AiModule {}

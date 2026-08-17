import { Module } from '@nestjs/common';
import { QueryService } from './query.service.js';
import { QueryController } from './query.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { knowledgeBaseProtoPath } from '@cntx/rpc-protos';
import { LLMModule } from '../llm/llm.module.js';

@Module({
    imports: [
      LLMModule,
        ClientsModule.register([
            {
                name: 'KNOWLEDGEBASE',
                transport: Transport.GRPC,
                options: {
                    url: 'localhost:3003',
                    package: 'knowledgeBase',
                    protoPath:knowledgeBaseProtoPath
                },
            },
        ]),
    ],
    controllers: [QueryController],
    providers: [QueryService],
})
export class QueryModule {}

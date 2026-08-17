import { Module } from '@nestjs/common';
import { RetrivalController } from './retrival.controller.js';
import { RetrivalService } from './retrival.service.js';
import { AiModule } from '../AI/ai.module.js';
import { DataStoreModule } from '../data-store/data-store.module.js';

@Module({
    imports: [AiModule,DataStoreModule],
    controllers: [RetrivalController],
    providers: [RetrivalService],
})
export class RetrivalModule {}

import { Module } from '@nestjs/common';
import { ProcessService } from './process.service.js';
import { ProcessController } from './process.controller.js';
import { DataStoreModule } from '../data-store/data-store.module.js';
import { AiModule } from '../AI/ai.module.js';
import { StorageModule } from '../storage/storage.module.js';

@Module({
    imports: [AiModule, DataStoreModule, StorageModule],
    controllers: [ProcessController],
    providers: [ProcessService],
})
export class ProcessModule {}

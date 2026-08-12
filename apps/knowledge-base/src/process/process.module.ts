import { Module } from '@nestjs/common';
import { ProcessService } from './process.service.js';
import { ProcessController } from './process.controller.js';
import { DataStoreModule } from '../data-store/data-store.module.js';
import { AiModule } from '../AI/ai.module.js';
import { StorageModule } from '../storage/storage.module.js';

@Module({
  controllers: [ProcessController],
  providers: [ProcessService],
  imports:[AiModule,DataStoreModule,StorageModule]
})
export class ProcessModule {}

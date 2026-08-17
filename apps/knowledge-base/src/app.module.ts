import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module.js';
import { DataStoreModule } from './data-store/data-store.module.js';
import { StorageModule } from './storage/storage.module.js';
import { ProcessModule } from './process/process.module.js';
import { RetrivalModule } from './retrival/retrival.module.js';

@Module({
  imports: [ConfigModule,DataStoreModule,StorageModule,ProcessModule,RetrivalModule],
})
export class AppModule {}

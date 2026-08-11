import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module.js';
import { StorageModule } from './storage/storage.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [ConfigModule,StorageModule,DatabaseModule],
})
export class AppModule {}

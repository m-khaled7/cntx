import { Module } from '@nestjs/common';
import { QueryModule } from './query/query.module.js';
import { ConfigModule } from './config/config.module.js';

@Module({
  imports: [ConfigModule,QueryModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module.js';
import { StorageModule } from './storage/storage.module.js';
import { DatabaseModule } from './database/database.module.js';
import { UploadValidationModule } from './upload-validation/upload-validation.module.js';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
    imports: [
        ConfigModule,
        StorageModule,
        DatabaseModule,
        UploadValidationModule,
        RabbitMQModule.forRoot({
            uri: process.env.RMQ_URL!,
            enableControllerDiscovery: true,
        }),
    ],
})
export class AppModule {}

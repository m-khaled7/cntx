import { Module } from '@nestjs/common';
import { UploadValidationService } from './upload-validation.service.js';
import { UploadValidationController } from './upload-validation.controller.js';
import { StorageModule } from '../storage/storage.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        StorageModule,
        DatabaseModule,
        ClientsModule.register([
            {
                name: 'KNOWLEDGE_BASE_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RMQ_URL!],
                    queue: 'knowledge-base-queue',
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
    ],
    controllers: [UploadValidationController],
    providers: [UploadValidationService],
})
export class UploadValidationModule {}

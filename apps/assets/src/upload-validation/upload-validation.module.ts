import { Module } from '@nestjs/common';
import { UploadValidationService } from './upload-validation.service.js';
import { UploadValidationController } from './upload-validation.controller.js';
import { StorageModule } from '../storage/storage.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        StorageModule,
        DatabaseModule,
        ClientsModule.registerAsync([
            {
                name: 'KNOWLEDGE_BASE_SERVICE',
                imports: [],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.getOrThrow<string>('RMQ_URL')],
                        queue: 'knowledge-base-queue',
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
            },
        ]),
    ],
    controllers: [UploadValidationController],
    providers: [UploadValidationService],
})
export class UploadValidationModule {}

import { Module } from '@nestjs/common';
import { MinioProvider } from './providers/minio.provider.js';
import { StorageClient } from './storage-client.js';
import { StorageService } from './storage.service.js';
import { StorageController } from './storage.controller.js';

@Module({
    providers: [{ provide: StorageClient, useClass: MinioProvider }, StorageService],
    controllers: [StorageController],
    exports: [StorageClient, StorageService],
})
export class StorageModule {}

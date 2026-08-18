import { Controller } from '@nestjs/common';
import { CreateUploadUrl } from './dto/create-upload-url.dto.js';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, status } from '@grpc/grpc-js';
import { StorageService } from './storage.service.js';

@Controller()
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @GrpcMethod('AssetsService')
    createUploadUrl(dto: CreateUploadUrl, metadata: Metadata) {
        const rawUserId =
            metadata?.get('x-user-id')?.[0] ??
            metadata?.get('X-User-Id')?.[0] ??
            metadata?.get('user-id')?.[0];

        const userId = typeof rawUserId === 'string' ? rawUserId : undefined;
        if (!userId) {
            throw new RpcException({
                code: status.UNAUTHENTICATED,
                message: 'Missing X-User-Id metadata header',
            });
        }
        return this.storageService.createPostUrl(dto, userId);
    }
}

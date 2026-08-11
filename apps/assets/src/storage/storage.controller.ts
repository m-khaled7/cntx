import { Controller } from '@nestjs/common';
import { CreateUploadUrl } from './dto/create-Upload-Url.dto.js';
import {GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { StorageService } from './storage.service.js';

@Controller()
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @GrpcMethod("AssetsService")
    createUploadUrl(dto: CreateUploadUrl, metadata: Metadata) {
        const userId = metadata.get("X-User-Id")[0] as string;
        return this.storageService.createPostUrl(dto, userId);
    }


}

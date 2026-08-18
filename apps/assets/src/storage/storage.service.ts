import { Injectable } from '@nestjs/common';
import { FileMetadata, StorageClient } from './storage-client.js';
import path from 'path';
import { CreateUploadUrl } from './dto/create-upload-url.dto.js';

@Injectable()
export class StorageService {
    constructor(private readonly storageClient: StorageClient) {}

    async createPostUrl(dto: CreateUploadUrl, userId: string) {
        const { fileName } = dto;
        const objectName = this.generateFileName(fileName);
        const metadata: FileMetadata = {
            uploadedBy: userId,
            originalName: fileName,
        };
        const { postURL, formData } = await this.storageClient.createPreSignedPost(
            objectName,
            metadata
        );
        const stringFormData: Record<string, string> = {}; // serialize form data to map<string,string>
        Object.entries(formData).forEach(([k, v]) => {
            stringFormData[k] = String(v);
        });
        return { postURL, formData: stringFormData };
    }

    private generateFileName(fileName: string): string {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        return ['file', '-', uniqueSuffix, path.extname(fileName)].join('');
    }
}

import { Injectable } from "@nestjs/common";
import { StorageClient } from "./storage-client.js";
import path from "path";
import { fileMetadata } from "../common/types/files.types.js";
import { CreateUploadUrl } from "./dto/create-Upload-Url.dto.js";

@Injectable()
export class StorageService {
    constructor(private readonly storageClient: StorageClient) {}

    async createPostUrl(dto: CreateUploadUrl, userId: string) {
        const { fileName } = dto;
        const objectName = this.generateFileName(fileName);
        const metadata: fileMetadata = {
            uploadedBy: userId,
            originalName: fileName,
        };
        const { postURL, formData } = await this.storageClient.createPreSignedPost(
            objectName,
            metadata
        );
        const stringFormData = {}; //serialize form data to map<string,strig> to satisfy rpc and frontend
        Object.entries(formData).forEach(([k, v]) => {
            stringFormData[k] = String(v);
        });
        return { postURL, formData: stringFormData };
    }

    generateFileName(fileName: string): string {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        return ['file', '-', uniqueSuffix, path.extname(fileName)].join('');
    }
}
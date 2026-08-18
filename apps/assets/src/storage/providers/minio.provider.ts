import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinioOptions } from '../../config/configs/minio.config.js';
import { FileMetadata, StorageClient } from '../storage-client.js';

@Injectable()
export class MinioProvider implements StorageClient {
    private client: Client;
    private readonly config: MinioOptions;

    constructor(private readonly configService: ConfigService) {
        this.config = this.configService.getOrThrow('minio');
    }

    getClient(): Client {
        if (!this.client) {
            this.client = new Client({
                endPoint: this.config.endPoint,
                port: this.config.port,
                useSSL: this.config.useSSL,
                accessKey: this.config.accessKey,
                secretKey: this.config.secretKey,
            });
        }
        return this.client;
    }

    async createPreSignedPost(fileName: string, metadata: FileMetadata) {
        const client = this.getClient();
        const policy = client.newPostPolicy();
        policy.setBucket(this.config.docsBucketName);
        policy.setKey(fileName);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + this.config.urlExp);
        policy.setExpires(expires);
        policy.setContentLengthRange(1024, this.config.maxFileSize * (1024 * 1024));
        policy.setUserMetaData(metadata);
        const { postURL, formData } = await client.presignedPostPolicy(policy);
        return { postURL, formData };
    }

    getObject(objectName: string, bucketName = this.config.docsBucketName) {
        return this.getClient().getObject(bucketName, objectName);
    }

    removeObject(objectName: string, bucketName = this.config.docsBucketName) {
        return this.getClient().removeObject(bucketName, objectName);
    }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinioOptions } from '../../config/configs/minio.config.js';
import { StorageClient } from '../storage-client.js';
@Injectable()
export class MinioProvider implements StorageClient {
    private client: Client;
    private readonly config: MinioOptions;

    constructor(private readonly configService: ConfigService) {
        this.config = this.configService.getOrThrow('minio');
    }
    
    getClient() {
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

    getObject( onjectName: string,bucketName=this.config.docsBucketName) {
        return this.client.getObject(bucketName, onjectName);
    }

    removeObject( onjectName: string,bucketName=this.config.docsBucketName) {
        return this.client.removeObject(bucketName, onjectName);
    }
}

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

    async getObject( objectName: string,bucketName=this.config.docsBucketName) {
        const client=this.getClient()
          const stream = await client.getObject(bucketName, objectName);
          const chunks: any[] = [];
          for await (const data of stream) {
              chunks.push(data);
          }
          return Buffer.concat(chunks);
    }

    removeObject( onjectName: string,bucketName=this.config.docsBucketName) {
        return this.client.removeObject(bucketName, onjectName);
    }
}

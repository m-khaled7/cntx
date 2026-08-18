import { registerAs } from '@nestjs/config';

export interface MinioOptions {
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    urlExp: number; // minute
    maxFileSize: number; // MB
    docsBucketName: string;
}

export default registerAs('minio', (): MinioOptions => ({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: Number(process.env.MINIO_PORT!),
    useSSL: process.env.MINIO_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS!,
    secretKey: process.env.MINIO_SECRET!,
    urlExp: Number(process.env.MINIO_URL_EXP ?? 15),
    maxFileSize: Number(process.env.MINIO_MAX_FILE_SIZE ?? 100),
    docsBucketName: 'documents',
}));

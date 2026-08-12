import { registerAs } from "@nestjs/config";

export interface MinioOptions {
    endPoint:string;
    port:number
    useSSL:boolean
    accessKey:string,
    secretKey:string,
    docsBucketName:string
}

export default registerAs(
    "minio",
    (): MinioOptions => ({
        endPoint: process.env.MINIO_ENDPOINT!,
        port: Number(process.env.MINIO_PORT!),
        useSSL: false,
        accessKey: process.env.MINIO_ACCESS!,
        secretKey: process.env.MINIO_SECRET!,
        docsBucketName:'documents'
    })
);

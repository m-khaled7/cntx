export interface MinioEvent{
    Records:MinioEventRecord[]
}
export interface MinioEventRecord {
    s3: {
        bucket: { name: string };
        object: {
            key: string;
            size: number;
            eTag:string,
            contentType?: string;
            userMetadata?: Record<string, string>;
        };
    };
}

export interface UploadedFileData {
    objectName: string;
    size: number;
    originalName?: string;
    userId?: string;
}

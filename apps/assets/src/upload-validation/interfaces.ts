
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

//emited event data after successfull validation
export interface UploadedFileEventData {
    objectName: string;
    mimeType: string;
    userId: string;
    assetId: string;
}
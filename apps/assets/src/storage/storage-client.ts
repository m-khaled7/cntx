import Stream from 'stream';

export interface PreSignedPost {
    postURL: string;
    formData: Record<string, string>;
}
export interface FileMetadata {
    uploadedBy: string;
    originalName: string;
    [key: string]: string;
}
export abstract class StorageClient {
    abstract createPreSignedPost(
        objectName: string,
        metadata: FileMetadata
    ): Promise<PreSignedPost>;
    abstract getObject(objectName: string, bucketName?: string): Promise<Stream.Readable>;
    abstract removeObject(objectName: string, bucketName?: string): Promise<void>;
}

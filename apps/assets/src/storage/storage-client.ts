import Stream from "stream";

export interface PreSignedPost {
    postURL: string;
    formData: Record<string, string>;
}
export interface fileMetadata {
    uploadedBy: string;
    originalName: string;
    [key: string]: string;
}
export abstract class StorageClient {
    abstract createPreSignedPost(
        objectName: string,
        metadata: fileMetadata
    ): Promise<PreSignedPost>;
        abstract getObject( onjectName: string,bucketName?: string,): Promise<Stream.Readable>;
        abstract removeObject( onjectName: string,bucketName?: string,): Promise<void>;
}

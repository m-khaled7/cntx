import Stream from "stream";

export abstract class StorageClient {
        abstract getObject( onjectName: string,bucketName?: string,): Promise<Stream.Readable>;
        abstract removeObject( onjectName: string,bucketName?: string,): Promise<void>;
}

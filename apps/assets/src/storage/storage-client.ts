import Stream from "stream";
import { fileMetadata } from "../common/types/files.types.js";
import { PreSignedPost } from "./storage.interfaces.js";

export abstract class StorageClient {
    abstract createPreSignedPost(
        objectName: string,
        metadata: fileMetadata
    ): Promise<PreSignedPost>;
        abstract getObject( onjectName: string,bucketName?: string,): Promise<Stream.Readable>;
        abstract removeObject( onjectName: string,bucketName?: string,): Promise<void>;
}

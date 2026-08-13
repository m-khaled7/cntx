import { Module } from "@nestjs/common";
import { MinioProvider } from "./providers/minio.provider.js";
import { StorageClient } from "./storage-client.js";


@Module({
    providers: [{ provide: StorageClient, useClass: MinioProvider },],
    exports: [StorageClient,],
})
export class StorageModule {}

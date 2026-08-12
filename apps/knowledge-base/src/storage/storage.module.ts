import { Global, Module } from "@nestjs/common";
import { MinioProvider } from "./providers/minio.provider.js";
import { StorageClient } from "./storage-client.js";

@Global()
@Module({
    providers: [{ provide: StorageClient, useClass: MinioProvider },],
    exports: [StorageClient,],
})
export class StorageModule {}

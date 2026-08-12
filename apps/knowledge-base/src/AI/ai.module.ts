import { Module } from "@nestjs/common";
import { DenseModel } from "./base/dense.model.js";
import { GoogleProvider } from "./providers/google.provider.js";

@Module({
    providers: [
        {
            provide: DenseModel,
            useClass: GoogleProvider,
        },
    ],
    exports:[DenseModel]
})
export class AiModule {}

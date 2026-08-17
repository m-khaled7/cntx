import { Module } from "@nestjs/common";
import { LLMModel } from "./llm.model.js";
import { GoogleProvider } from "./providers/google.provider.js";

@Module({
    providers:[{provide:LLMModel,useClass:GoogleProvider}],
    exports:[LLMModel]
})
export class LLMModule{}
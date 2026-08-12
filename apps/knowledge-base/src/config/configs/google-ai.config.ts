import { registerAs } from "@nestjs/config";

export interface GoogleAiConfig{
    apiKey:string,
    denseModel:string,
    dimSize:number
}

export default registerAs(
    "googleAi",
    (): GoogleAiConfig => ({
        apiKey: process.env.GOOGLE_API_KEY!,
        denseModel: process.env.GOOGLE_EMBED_MODEL ?? "gemini-embedding-001",
        dimSize: 2048,
    })
);
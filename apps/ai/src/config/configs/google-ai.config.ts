import { registerAs } from "@nestjs/config";

export interface GoogleAiConfig{
    apiKey:string,
    generationModel:string
}

export default registerAs('googleAi', (): GoogleAiConfig => ({
    apiKey: process.env.GOOGLE_API_KEY!,
    generationModel: process.env.GOOGLE_GEN_MODEL ?? 'gemini-3.7-flash',
}));
import { Injectable } from "@nestjs/common";
import { GoogleAiConfig } from "../../config/configs/google-ai.config.js";
import { ConfigService } from "@nestjs/config";
import { GoogleGenAI } from '@google/genai';
import { LLMModel } from "../llm.model.js";
@Injectable()
export class GoogleProvider implements LLMModel {
    private ai!: GoogleGenAI;
    private readonly config!: GoogleAiConfig;

    constructor(private readonly configService: ConfigService) {
        this.config = this.configService.getOrThrow('googleAi');
    }
    private getAi() {
        if (!this.ai) {
            this.ai = new GoogleGenAI({ apiKey: this.config.apiKey });
        }
        return this.ai;
    }

    async generateText(system_instruction: string, input: string) {
        const ai=this.getAi()
        const interaction = await ai.interactions.create({
            model: this.config.generationModel,
            input,
            system_instruction,
        });
        return interaction.output_text;
    }
}
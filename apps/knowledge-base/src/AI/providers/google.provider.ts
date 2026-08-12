import { GoogleGenAI } from "@google/genai";
import { ConfigService } from "@nestjs/config";
import { DenseModel } from "../base/dense.model.js";
import { Injectable } from "@nestjs/common";
import { GoogleAiConfig } from "../../config/configs/google-ai.config.js";

@Injectable()
export class GoogleProvider implements DenseModel{
    private ai!:GoogleGenAI
    private readonly config!:GoogleAiConfig

    constructor(private readonly configService:ConfigService){
        this.config= this.configService.getOrThrow("googleAi")
    }
    private getAi(){
        if(!this.ai){
            this.ai=new GoogleGenAI({apiKey:this.config.apiKey})
        }
        return this.ai
    }

    async generateDenseVectors(text: string[]): Promise<number[][]|undefined> {
        const ai = this.getAi()
        const response= await ai.models.embedContent({
            model:this.config.denseModel,
            contents:text
        })
        
        if(!response.embeddings)return undefined
        const vectors= response.embeddings.map(embed=>embed.values!)
        return vectors
    }


}
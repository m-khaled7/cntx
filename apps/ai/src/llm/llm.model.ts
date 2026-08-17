export abstract class LLMModel{
    abstract generateText(sysPrompt:string,query:string):Promise<string|undefined>
}
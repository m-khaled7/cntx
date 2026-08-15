import { IsString } from 'class-validator'
export class GetRelevantChunks {
    @IsString()
    query:string
}
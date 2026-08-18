import { IsString, Length } from 'class-validator';

export class CreateUploadUrl {
    @IsString()
    @Length(3, 100, { message: 'File name is too long.' })
    fileName!: string;
}

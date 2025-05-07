import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    authorId: number;

    @IsString()
    @IsNotEmpty()
    content: string;
}
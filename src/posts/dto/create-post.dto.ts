import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    @ApiProperty({
        example: '차 추천해주세요!',
        description: '포스트 제목',
        minLength: 2,
        maxLength: 20,
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '차 사려는데 2억 이하로 추천해주세요!',
        description: '포스트 내용'
    })
    content: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({
        each: true,
    })
    @ArrayMaxSize(3)
    @ApiProperty({
        example: ['자동차', '2억'],
        description: '태그',
        maxItems: 3,
    })
    tags: string[]
}
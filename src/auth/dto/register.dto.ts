import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDto{
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: '1234@gmail.com',
        description: '이메일'
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123123',
        description: '비밀번호'
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '안녕하세요 코드팩토리입니다!',
        description: '소개'
    })
    bio: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '안녕하세요 코드팩토리입니다!',
        description: '소개',
        nullable: true,
        required: false,
    })
    profileImage?: string;
}
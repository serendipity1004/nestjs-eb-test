import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @ApiProperty({
        example: '123@gmail.com',
        description: '이메일'
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123123',
        description: '비밀번호',
    })
    password: string;
}
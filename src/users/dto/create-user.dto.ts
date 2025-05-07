import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    password: string;

    @IsString()
    @IsNotEmpty()
    bio: string;

    @IsString()
    profileImage?: string;
}

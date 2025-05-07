import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsInt, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsInt()
    age: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto){}
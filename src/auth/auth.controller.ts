import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors, Headers, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path';
import { v4 } from 'uuid';
import { join } from 'path';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicTokenGuard } from './guard/basic-token.guard';


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    description: '이메일과 비밀번호로 회원가입을 진행합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: '이메일이 중복됐거나 입력한 값이 잘못됨',
  })
  async register(
    @Body() registerDto: RegisterDto
  ) {
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  @UseGuards(BasicTokenGuard)
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인을 진행합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'asdvoizxcvj.asdfivjzxocivj.asdfijf'
        },
        accessToken: {
          type: 'string',
          example: 'asdfivxzcv.asdfiajsodf.zxcvszaxcv'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: '이메일이 중복됐거나 입력한 값이 잘못됨',
  })
  async login(@Body() loginDto: LoginDto, @Request() request) {
    return this.authService.loginUser(request.credential as {email: string, password: string});
  }
}

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AccessTokenPayload } from './type/access-token-payload.type';
import { basename, join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) { }

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    comparePasswordAndHash(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async issueAuthTokens(payload: AccessTokenPayload, type: 'access' | 'refresh' = 'access') {
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '1d',
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    async registerUser(registerDto: RegisterDto) {

        const hash = await this.hashPassword(registerDto.password);

        let newPath;

        if (registerDto.profileImage) {
            const fileName = basename(registerDto.profileImage);
            newPath = join('uploads', 'profileImage', fileName);

            try {
                await fs.rename(join(process.cwd(), registerDto.profileImage), join(process.cwd(), newPath));
            } catch (e) {
                throw new BadRequestException('프로필 이미지를 다시 업로드 해주세요');
            }
        }

        const user = this.userRepository.create({
            ...registerDto,
            password: hash,
            profile: {
                bio: registerDto.bio,
                profileImage: newPath,
            }
        })

        try {
            await this.userRepository.save(user);

            return this.userRepository.findOneBy({ email: registerDto.email });
        } catch (e) {
            if (e.code === '23505') {
                if (e.detail.includes('(email)=')) {
                    throw new BadRequestException('이미 가입한 이메일입니다.');
                }
                throw new BadRequestException('중복 값 에러');
            }
        }
    }

    async loginUser(loginDto: LoginDto) {
        const user = await this.userRepository.findOneBy({
            email: loginDto.email,
        });

        const isPassValid = await this.comparePasswordAndHash(
            loginDto.password,
            user.password,
        );

        if (!isPassValid) {
            throw new UnauthorizedException('비밀번호가 잘못됐습니다.')
        }

        return this.issueAuthTokens({
            id: user.id,
            email: user.email,
            role: user.role,
        });
    }

    validateBasicToken(header: string) {
        // 입력된 헤더는 Basic xxxx 방식

        const [scheme, encoded] = header.split(' ');

        if (scheme !== 'Basic' || !encoded) {
            throw new UnauthorizedException('Basic 인증 스킴이 아닙니다.');
        }

        const credentials = this.decodeBase64(encoded);
        const [username, password] = credentials.split(':');

        if (!username || !password) {
            throw new UnauthorizedException('username 또는 password가 비어 있습니다.');
        }

        return {
            email: username,
            password,
        }
    }

    decodeBase64(encoded: string) {
        try {
            const buffer = Buffer.from(encoded, 'base64');
            return buffer.toString('utf-8');
        } catch (e) {
            throw new UnauthorizedException('Base64 디코딩 실패');
        }
    }
}

// auth/guards/access-token.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Access Token이 없습니다.');
        }

        const token = authHeader.replace('Bearer ', '').trim();

        try {
            const payload = this.jwtService.verify(token);
            request['user'] = payload;
            return true;
        } catch (err) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다');
        }
    }
}

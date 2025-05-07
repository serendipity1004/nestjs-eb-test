// guards/basic-token.guard.ts

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization 헤더가 없습니다.');
    }

    const [scheme, encoded] = authHeader.split(' ');

    if (scheme !== 'Basic' || !encoded) {
      throw new UnauthorizedException('Basic 인증 스킴이 아닙니다.');
    }

    const credentials = this.decodeBase64(encoded);
    const [username, password] = credentials.split(':');

    if (!username || !password) {
      throw new UnauthorizedException('username 또는 password가 비어 있습니다.');
    }

    request.credential = {
        email: username,
        password,
    }

    return true;
  }

  private decodeBase64(encoded: string): string {
    try {
      const buffer = Buffer.from(encoded, 'base64');
      return buffer.toString('utf-8');
    } catch (e) {
      throw new UnauthorizedException('Base64 디코딩 실패');
    }
  }
}

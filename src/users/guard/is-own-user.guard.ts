import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class IsOwnUserGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new UnauthorizedException();

    const userId = parseInt(request.params.id);

    // ✅ 관리자면 바로 통과
    if (user.role === 'admin') return true;

    if (user.id !== userId) {
      throw new ForbiddenException('포스트 생성자 또는 어드민만 접근 가능합니다!');
    }

    return true;
  }
}
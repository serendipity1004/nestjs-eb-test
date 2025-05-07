import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PostsService } from "../posts.service";

@Injectable()
export class IsOwnPostGuard implements CanActivate {
    constructor(
        private readonly postsService: PostsService,
    ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new UnauthorizedException();

    const postId = parseInt(request.params.id);

    const post = await this.postsService.findOne(postId);

    // ✅ 관리자면 바로 통과
    if (user.role === 'admin') return true;

    if (user.id !== post.author?.id) {
      throw new ForbiddenException('포스트 생성자 또는 어드민만 접근 가능합니다!');
    }

    return true;
  }
}
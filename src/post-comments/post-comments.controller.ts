import { Controller } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';

@Controller('post-comments')
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}
}

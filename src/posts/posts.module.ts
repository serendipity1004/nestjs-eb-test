import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostCommentEntity } from 'src/post-comments/entities/post-comment.entity';
import { CommentsService } from './comment.service';
import { CommentsController } from './comments.controller';
import { TagEntity } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      PostCommentEntity,
      TagEntity,
    ])
  ],
  controllers: [
    PostsController,
    CommentsController,
  ],
  providers: [
    PostsService,
    CommentsService
  ],
})
export class PostsModule { }

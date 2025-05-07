import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CommentsService } from "./comment.service";

@Controller('posts/:pid/comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
    ) { }

    @Post()
    create(@Param('pid', ParseIntPipe) postId: number, @Body() createPostDto: CreateCommentDto) {
        return this.commentsService.create(postId, createPostDto);
    }

    @Get()
    findAll(@Param('pid', ParseIntPipe) postId: number){
        return this.commentsService.findAll(postId);
    }
}

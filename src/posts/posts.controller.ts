import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { User } from 'src/auth/param/user.param';
import { AccessTokenPayload } from 'src/auth/type/access-token-payload.type';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { IsOwnPostGuard } from './guard/is-own-post.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '포스트 생성',
    description: '로그인한 사용지 기반으로 포스트를 생성한다.',
  })
  @ApiResponse({
    status: 201,
    description: '포스트 생성 성공',
    type: PostEntity,
  })
  @ApiBadRequestResponse({
    description: '잘못된 값 입력',
  })
  @ApiBearerAuth()
  create(@Body() createPostDto: CreatePostDto, @User() user: AccessTokenPayload) {
    return this.postsService.create(createPostDto, user.id);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({
    exceptionFactory: (errors) => new BadRequestException('ID를 숫자로 입력해주세요')
  })) id: string) {
    console.log('컨트롤러 실행!')

    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, IsOwnPostGuard)
  update(@Param('id', ParseIntPipe) id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, IsOwnPostGuard)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.postsService.remove(+id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) { }

  async create(createPostDto: CreatePostDto, authorId: number): Promise<PostEntity> {
    await this.tagRepository.upsert(
      createPostDto.tags.map((tag) => ({ name: tag })),
      ['name']
    );

    const tags = await this.tagRepository.find({
      where: createPostDto.tags.map((tag) => ({
        name: tag,
      }))
    });

    const post = this.postRepository.create({
      ...createPostDto,
      author: {
        id: authorId,
      },
      tags,
    });

    const saveResult = await this.postRepository.save(post);

    return this.findOne(saveResult.id);
  }

  findAll(): Promise<PostEntity[]> {
    return this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .getMany();
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException(`ID(${id})의 포스트를 찾지 못했습니다.`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    // 1. 기존 게시글 조회
    const post = await this.findOne(id);

    let tags = [];

    // 2. 태그가 존재할 경우 처리
    if (updatePostDto.tags && updatePostDto.tags.length > 0) {
      // 2-1. 태그 upsert (존재하면 무시, 없으면 생성)
      await this.tagRepository.upsert(
        updatePostDto.tags.map((tag) => ({ name: tag })),
        ['name']
      );

      // 2-2. 방금 upsert한 태그들을 다시 조회
      tags = await this.tagRepository.find({
        where: updatePostDto.tags.map((tag) => ({ name: tag })),
      });
    }

    // 3. 게시글 병합 (merge: 기존 + 수정값 + 관계)
    const updated = this.postRepository.merge({
      ...post,
      // 기존 Tag들은 삭제해주기
      tags: [],
    }, {
      ...updatePostDto,
      tags, // 관계된 태그들 연결
    });

    // 4. 저장 (업데이트)
    await this.postRepository.save(updated);

    // 5. 최신 상태 다시 조회 후 반환
    return this.findOne(id);
  }

  async remove(id: number): Promise<number> {
    await this.findOne(id);

    await this.postRepository.delete(id);

    return id;
  }
}

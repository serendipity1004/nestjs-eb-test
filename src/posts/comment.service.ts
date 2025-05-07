import { InjectRepository } from "@nestjs/typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Repository } from "typeorm";
import { PostCommentEntity } from "src/post-comments/entities/post-comment.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(PostCommentEntity)
        private readonly commentsRepository: Repository<PostCommentEntity>,
    ) { }

    async create(postId: number, createPostDto: CreateCommentDto) {
        const comment = this.commentsRepository.create({
            ...createPostDto,
            author: {
                id: createPostDto.authorId,
            },
            post: {
                id: postId,
            }
        });

        return this.commentsRepository.save(comment);
    }

    async findAll(postId: number) {
        return this.commentsRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.author', 'author')
            .leftJoin('comment.post', 'post')
            .where('post.id = :pid', { pid: postId })
            .getMany();
    }
}
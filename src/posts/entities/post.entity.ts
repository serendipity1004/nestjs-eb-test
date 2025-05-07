import { PostCommentEntity } from "src/post-comments/entities/post-comment.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TagEntity } from "./tag.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> UserEntity, (user) => user.posts)
    @ApiProperty({
        type: UserEntity,
        description: '작성자',
    })
    author: UserEntity;

    @Column()
    @ApiProperty({
        example: '안녕하세요 현대차 사원입니다...',
        description: '제목',
    })
    title: string;

    @Column()
    @ApiProperty({
        example: '성공하려면 어떤 스킬을 배우면 좋을까요?',
        description: '제목',
    })
    content: string;

    @OneToMany(()=> PostCommentEntity, (pc) => pc.post)
    comments: PostCommentEntity[];

    @ManyToMany(()=> TagEntity, (tag) => tag.posts)
    @JoinTable()
    @ApiProperty({
        description: '제목',
        isArray: true,
        type: TagEntity
    })
    tags: TagEntity[];

    @CreateDateColumn()
    @ApiProperty({
        example: '20045123',
        description: '생성 날짜',
    })
    createdAt: Date;
}

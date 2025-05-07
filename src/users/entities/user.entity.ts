import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfileEntity } from "./user-profile.entity";
import { PostEntity } from "src/posts/entities/post.entity";
import { PostCommentEntity } from "src/post-comments/entities/post-comment.entity";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        example: '123',
        description: '사용자 ID'
    })
    id: number;

    @Column({
        unique: true,
    })
    @ApiProperty({
        example: '123@gmail.com',
        description: '이메일'
    })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        default: 'user',
    })
    role: 'user' | 'admin';

    @OneToOne(()=> UserProfileEntity, (profile) => profile.user, {
        cascade: true,
        eager: true,
    })
    @ApiProperty({
        description: '이메일',
        type: UserProfileEntity,
    })
    profile: UserProfileEntity;

    @OneToMany(()=> PostEntity, (post) => post.author)
    posts: PostEntity[];

    @OneToMany(()=> PostCommentEntity, (pc) => pc.author)
    postComments: PostCommentEntity[];

    @CreateDateColumn()
    @ApiProperty({
        example: '19921123xxxx',
        description: '가입일자',
    })
    createdAt: Date;
}

import { PostEntity } from "src/posts/entities/post.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('post_comment')
export class PostCommentEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> UserEntity, (user) => user.postComments)
    author: UserEntity;

    @ManyToOne(()=> PostEntity, (post) => post.comments)
    post: PostEntity;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
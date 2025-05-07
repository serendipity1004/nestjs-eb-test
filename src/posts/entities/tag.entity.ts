import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('tag')
export class TagEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        example: '태그 ID',
        description: '태그 ID',
    })
    id: number;

    @Column({
        unique: true,
    })
    @ApiProperty({
        example: '태그 이름',
        description: '태그 이름',
    })
    name: string;

    @ManyToMany(()=> PostEntity, (post) => post.tags)
    posts: PostEntity[];
}
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { Expose, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity('user_profile')
export class UserProfileEntity {
    @PrimaryColumn()
    userId: number;

    @OneToOne(()=> UserEntity, (user) => user.profile, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @Column()
    @ApiProperty({
        example: '안녕하세요!',
        description: '자기소개'
    })
    bio: string;

    @Column({
        nullable: true
    })
    profileImage?: string;
  
    @CreateDateColumn()
    @ApiProperty({
        example: '20250132xxxx',
        description: '생성 일자'
    })
    createdAt: Date;

    @Expose({
        name: 'profileImage',
    })
    @Transform(({value}) => {
        if(!value) return null;

        return `http://localhost:3000/${value}`;
    })
    @ApiProperty({
        name: 'profileImage',
        example: 'http://localhost:3000/posts/123',
        description: '프로필 이미지 URL',
        nullable: true,
    })
    get profileImageUrl(){
        return this.profileImage;
    }
}
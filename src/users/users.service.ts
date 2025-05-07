import { BadRequestException, Inject, Injectable, LoggerService } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserProfileEntity } from './entities/user-profile.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { basename, join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    this.logger.log('사용자 생성 시도중', 'UserService/create')

    try {
      const user = this.userRepository.create({
        ...createUserDto,
        profile: {
          bio: createUserDto.bio,
        }
      })

      await this.userRepository.save(user);

      return this.userRepository.findOneBy({ email: createUserDto.email });
    } catch (e) {
      this.logger.error('사용자 생성 실패', e.stackTrace, 'UserService/create')
      if (e.code === '23505') {
        if (e.detail.includes('(email)=')) {
          throw new BadRequestException('이미 가입한 이메일입니다.');
        }
        throw new BadRequestException('중복 값 에러');
      }
    }
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({
      id
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);

    let newProfileImagePath = updateUserDto.profileImage;

    if (updateUserDto.profileImage && updateUserDto.profileImage.includes('/uploads/temporary/')) {
      const fileName = basename(updateUserDto.profileImage);
      newProfileImagePath = join('uploads', 'profileImage', fileName);

      try {
        await fs.rename(join(process.cwd(), updateUserDto.profileImage), join(process.cwd(), newProfileImagePath));
      } catch (e) {
        throw new BadRequestException('프로필 이미지를 다시 업로드 해주세요');
      }
    }

    const updated = this.userRepository.merge(user, {
      ...updateUserDto,
      profile: {
        ...(user.profile ?? {}),
        bio: updateUserDto.bio,
        profileImage: newProfileImagePath,
      }
    });

    return this.userRepository.save(updated);
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.userRepository.delete(id);

    return id;
  }
}

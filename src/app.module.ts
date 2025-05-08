import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { UserProfileEntity } from './users/entities/user-profile.entity';
import { PostCommentsModule } from './post-comments/post-comments.module';
import { PostCommentEntity } from './post-comments/entities/post-comment.entity';
import { TagEntity } from './posts/entities/tag.entity';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { ErrorExceptionFilter } from './logger/error-logger.filter';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'codefactory'
    }),
    WinstonModule.forRoot(winstonConfig),
    TypeOrmModule.forRoot({
      url: 'postgresql://postgres.jicfvuofwxdsmzjuvzfa:m7PiKNST3110AfwC@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
      type: 'postgres',
      // host: 'postgres',
      // port: 5432,
      // username: 'postgres',
      // password: 'postgres',
      // database: 'postgres',
      entities: [
        PostEntity,
        UserEntity,
        UserProfileEntity,
        PostCommentEntity,
        TagEntity,
      ],
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
    PostCommentsModule,
    AuthModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    }
  ],
})
export class AppModule { }

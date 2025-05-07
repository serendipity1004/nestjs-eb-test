import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 } from 'uuid';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('image')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor(
    'image',
    {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'temporary'),
        filename: (req, file, cb) => {
          const uuid = v4();
          const ext = extname(file.originalname);
          const fileName = uuid + ext;
          cb(null, fileName);
        }
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('지원하지 않는 파일 형식입니다.'), false);
        }
      }
    }
  ))
  postImage(@UploadedFile() file: Express.Multer.File){
    return {
      fileName: join('uploads', 'temporary', file.filename),
    };
  }
}

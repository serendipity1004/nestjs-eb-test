import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const config = new DocumentBuilder()
  .setTitle('코드팩토리 API 문서')
  .setDescription('NestJS Swagger 예제')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  app.enableCors({
    origin: ['https://www.google.com']
  });
  app.useStaticAssets(
    join(process.cwd(), 'uploads'),
    {
      prefix: '/uploads/'
    }
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();

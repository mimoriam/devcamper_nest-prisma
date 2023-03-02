import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

// npm i class-validator class-transformer @nestjs/config @nestjs/throttler cookie-parser
// npm i -D @types/cookie-parser

// npm i -D prisma

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('SERVER_PORT');
  const server_url = configService.get('SERVER_URL');

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: [server_url],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // Set to true in Production:
      // forbidNonWhitelisted: true,
      // forbidUnknownValues: true,
    }),
  );
  app.use(cookieParser());

  try {
    await app.listen(port);
  } catch (err) {
    console.log(err);
  }
}
bootstrap().then();

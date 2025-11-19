import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // CORS 활성화
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    // SSE를 위한 추가 헤더
    exposedHeaders: ['Content-Type'],
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

// main.ts의 기본 구조
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. 앱 인스턴스 생성
  const app = await NestFactory.create(AppModule);

  // 2. 전역 설정
  app.enableCors(); // CORS 활성화

  // 3. 포트 설정 (.env에서 가져옴)
  const port = process.env.PORT || 3001;

  // 4. 서버 시작
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

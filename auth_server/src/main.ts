import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use((req, res, next) => {
    console.log('AuthServer 요청:', req.method, req.url);
    next();
  });

  const port = process.env.PORT || 3002;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

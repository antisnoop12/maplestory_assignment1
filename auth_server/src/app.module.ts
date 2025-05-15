import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    // 환경변수 설정
    ConfigModule.forRoot(),
    // MongoDB 연결
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    AuthModule,
    // 여기에 나중에 AuthModule, UsersModule 등이 추가될 예정
  ],
  controllers: [AppController],
})
export class AppModule {}

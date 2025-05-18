import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayModule } from './gateway/gateway.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGODB_URI), GatewayModule],
  controllers: [AppController],
})
export class AppModule {}

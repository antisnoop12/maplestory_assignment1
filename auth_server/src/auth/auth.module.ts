import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@auth/service/auth.service';
import { AuthController } from '@auth/controller/auth.controller';
import { UserModule } from '@user/user.module';
import { JwtStrategy } from '@auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './controller/admin.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController, AdminController],
  exports: [AuthService],
})
export class AuthModule {}

import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@auth/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    // 사용자 검증 및 토큰 발급
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    // 토큰과 사용자 정보 반환
    return this.authService.login(email, password);
  }
}

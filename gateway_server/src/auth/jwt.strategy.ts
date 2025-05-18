import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'AYWAYWAYWAYW',
    });
  }

  async validate(payload: any) {
    // payload에는 유저 정보와 role이 들어있어야 함
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}

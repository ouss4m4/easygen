import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET ??
        (() => {
          throw new Error('JWT_SECRET is not defined in .env');
        })(),
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.sub || !payload.name) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { userId: payload.sub, name: payload.name };
  }
}

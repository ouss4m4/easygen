import { Strategy as localStrategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ILoggedUser } from '../auth.types';

@Injectable()
export class LocalStrategy extends PassportStrategy(localStrategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  // whats return here will be attached to req.user
  async validate(email: string, password: string): Promise<ILoggedUser> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: user.userId, email: user.email, username: user.username };
  }
}

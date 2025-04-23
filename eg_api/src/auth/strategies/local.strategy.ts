import { Strategy as localStrategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { IUser } from '../auth.types';

@Injectable()
export class LocalStrategy extends PassportStrategy(localStrategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  // what is returnd here will be attached to req.user
  async validate(email: string, password: string): Promise<IUser> {
    const user = await this.authService.checkCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

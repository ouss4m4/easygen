import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ILoggedUser, ILoginResponse } from './auth.types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<ILoggedUser | null> {
    const user = await this.usersService.findOne(email);
    if (!user) return null;
    if (user && user.password === pass) {
      const { userId, username, email } = user;
      return {
        userId,
        username,
        email,
      };
    }
    return null;
  }

  // user is paased through passport (req.user)
  async login(user: ILoggedUser): Promise<ILoginResponse | null> {
    await new Promise((res) => setTimeout(res, 1000));

    const payload = { email: user.email, sub: user.userId };
    return {
      username: user.username,
      jwt: this.jwtService.sign(payload),
    };
  }
}

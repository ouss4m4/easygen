import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { IUser, JwtPayload, LoginResponse } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async checkCredentials(email: string, pass: string): Promise<IUser | null> {
    const user = await this.usersService.findRawByEmail(email);
    if (!user) return null;

    const samePass = await compare(pass, user.password);
    if (samePass) {
      const { id, name, email } = user;
      return {
        id,
        name,
        email,
      };
    }
    return null;
  }

  // user is paased through passport (req.user)
  async login(user: IUser): Promise<LoginResponse | null> {
    await new Promise((res) => setTimeout(res, 1000));

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    return {
      username: user.name,
      jwt: this.jwtService.sign(payload),
    };
  }
}

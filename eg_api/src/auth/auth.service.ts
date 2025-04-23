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
        id: id.toString(),
        name,
        email,
      };
    }
    return null;
  }

  login(user: IUser): LoginResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret:
        process.env.JWT_SECRET ??
        (() => {
          throw new Error('JWT_SECRET is not defined in .env');
        })(),
    });

    return {
      accessToken,
      expiresIn: 60 * 60,
      refreshToken: '',
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
    };
  }
}

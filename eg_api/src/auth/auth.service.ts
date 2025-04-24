import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { IUser, JwtPayload, LoginResponse } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // called by localstrat
  async checkCredentials(email: string, pass: string): Promise<IUser | null> {
    const user = await this.usersService.findRawByEmail(email);
    if (!user) return null;

    // Check if account is locked
    if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
      throw new UnauthorizedException('Account is locked. Try again later.');
    }

    const samePass = await compare(pass, user.password);

    if (samePass) {
      await this.usersService.resetLoginAttempts(user.id.toString());
      const { id, name, email } = user;
      return { id: id.toString(), name, email };
    } else {
      await this.usersService.incrementLoginAttempts(user.id.toString());
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // issuee 2 tokens on success. access and refresh
  login(user: IUser): LoginResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRY,
      secret: process.env.JWT_SECRET,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken: '',
      expiresIn: 36000,
    };
  }
}

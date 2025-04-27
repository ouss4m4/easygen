import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { IUser, JwtPayload, LoginResponse } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // called by localstrategy
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
  async login(user: IUser): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRY,
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY,
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const refreshTokenTtlInSeconds = this.getSecondsFromExpiry(
      process.env.JWT_REFRESH_EXPIRY,
    );
    await this.saveRefreshToken(
      refreshToken,
      user.id,
      refreshTokenTtlInSeconds,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
      expiresIn: 36000,
    };
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    console.log('----------------------------------');
    await this.cacheManager.set('ping', 'pong', 600);
    console.log('----------------------------------');
    const data = await this.cacheManager.get('ping');
    console.log(data);

    console.log('----------------------------------');
    try {
      const userId = await this.validateRefreshToken(refreshToken);

      if (!userId) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.deleteRefreshToken(refreshToken);

      const loginResponse = await this.login({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
      });

      // Save the new refresh token
      const refreshTokenTtlInSeconds = this.getSecondsFromExpiry(
        process.env.JWT_REFRESH_EXPIRY,
      );
      await this.saveRefreshToken(
        loginResponse.refreshToken,
        user.id.toString(),
        refreshTokenTtlInSeconds,
      );

      return loginResponse;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // --- JWT MANAGEMENT ---
  async saveRefreshToken(token: string, userId: string, ttlSeconds: number) {
    await this.cacheManager.set(`refresh:${token}`, userId, ttlSeconds);
  }

  async validateRefreshToken(token: string): Promise<string | null> {
    const userId = await this.cacheManager.get<string>(`refresh:${token}`);
    return userId;
  }

  async deleteRefreshToken(token: string) {
    await this.cacheManager.del(`refresh:${token}`);
  }

  // --- Helper method to calculate TTL seconds from expiry string (ENV must be set) ---
  private getSecondsFromExpiry(expiry: string | undefined): number {
    if (!expiry) return 0;
    if (expiry.endsWith('s')) {
      return parseInt(expiry.replace('s', ''));
    }
    if (expiry.endsWith('m')) {
      return parseInt(expiry.replace('m', '')) * 60;
    }
    if (expiry.endsWith('h')) {
      return parseInt(expiry.replace('h', '')) * 60 * 60;
    }
    if (expiry.endsWith('d')) {
      return parseInt(expiry.replace('d', '')) * 60 * 60 * 24;
    }
    return parseInt(expiry);
  }
}

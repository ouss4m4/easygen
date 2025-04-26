import {
  Controller,
  Post,
  Req,
  UseGuards,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { RequestWithUser, LoginResponse } from './auth.types';
import { LocalAuthGuard } from './guards/local.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

interface RequestWithCookies extends ExpressRequest {
  cookies: {
    refreshToken?: string;
  };
}

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    // type: LoginResponse,
  })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      example: {
        email: 'john@gmail.com',
        password: 'changeme',
      },
    },
  })
  login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...result } = this.authService.login(req.user);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return result;
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('auth/me')
  // @ApiOperation({ summary: 'Get user profile' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Profile retrieved successfully',
  //   type: 'IUser',
  // })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // getProfile(@Req() req: RequestWithUser) {
  //   return req.user;
  // }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiResponse({
    status: 200,
    description: 'New access token issued',
    // type: LoginResponse,
  })
  async refresh(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<LoginResponse, 'refreshToken'>> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const { refreshToken: newRefreshToken, ...result } =
      await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  }
}

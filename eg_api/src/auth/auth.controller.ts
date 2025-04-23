import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { RequestWithUser, LoginResponse } from './auth.types';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
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
  login(@Req() req: RequestWithUser): LoginResponse {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: 'IUser',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}

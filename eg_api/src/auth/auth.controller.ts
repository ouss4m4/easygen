import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { RequestWithUser } from './auth.types';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiBody({
    schema: {
      example: {
        email: 'john@gmail.com',
        password: 'changeme',
      },
    },
  })
  async login(@Req() req: RequestWithUser): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}

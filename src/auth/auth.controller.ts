import {
  BadRequestException,
  Post,
  Body,
  Request,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<any | BadRequestException> {
    return await this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() register: Prisma.UserCreateInput,
  ): Promise<any | BadRequestException> {
    return await this.authService.register(register);
  }
}

import { BadRequestException, Post, Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() register: Prisma.UserCreateInput,
  ): Promise<any | BadRequestException> {
    return await this.authService.register(register);
  }
}

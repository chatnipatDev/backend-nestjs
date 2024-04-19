import { UserService } from 'src/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(user: Prisma.UserCreateInput) {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exist');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.userService.createUser({ ...user, password: hashedPassword });
  }
}

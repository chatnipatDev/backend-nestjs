import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    return {
      access_token: this.jwtService.sign({
        email: user.email,
        id: user.id,
      }),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(email);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    const isMatch = await bcrypt.compareSync(password, existingUser.password);
    if (!isMatch) {
      throw new BadRequestException('Password incorrect');
    }
    return existingUser;
  }

  async register(user: Prisma.UserCreateInput) {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exist');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.userService.createUser({
      ...user,
      password: hashedPassword,
    });
    return this.login(createdUser);
  }
}

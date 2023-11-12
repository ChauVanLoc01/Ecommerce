import { Injectable } from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { PrismaService } from '@app/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { RegisterDTO } from './dtos/register.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async hashPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compareSync(password, hash);
  }

  async validateUser(user_name: string, password: string) {
    const accountExit = await this.prisma.account.findFirst({
      where: {
        user_name,
      },
    });

    if (!accountExit) {
      return 'User not found';
    }

    const isCorrectPassword = await this.hashPassword(
      password,
      accountExit.password,
    );

    if (!isCorrectPassword) {
      return 'Password is correct';
    }

    const userExist = await this.prisma.user.findUnique({
      where: {
        id: accountExit.userId,
      },
    });

    return userExist;
  }

  async createJwt(user: any) {}

  async register(registerDto: RegisterDTO) {

  }
}

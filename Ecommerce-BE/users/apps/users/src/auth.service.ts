import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser() {}

  async createAccessToken(id: string, role: number): Promise<string> {
    return this.jwtService.sign({ id, role });
  }

  async decode(type: 'access_token' | 'refresh_token', data: string) {
    if (type === 'access_token') {
      return this.jwtService.decode(data);
    }
    return this.jwtService.decode(data, {});
  }
}

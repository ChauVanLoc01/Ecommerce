import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDTO } from './dtos/login.dto';
import { LocalGuard } from './guards/local.guard';
import { RegisterDTO } from './dtos/register.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalGuard)
  @Post()
  login(@Body() loginDto: LoginDTO) {
    return this.userService.createJwt(loginDto);
  }

  @Post()
  register(@Body() registerDTO: RegisterDTO) {
    return this.userService.register(registerDTO);
  }

  // @Get()
  // findAll(@CurrentUser()) {

  // }

  @Get(':slug')
  findOne() {}
}

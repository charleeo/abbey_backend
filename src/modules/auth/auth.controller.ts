import { Response } from 'express';

import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() user: LoginDto, @Res() res: Response) {
    return await this.authService.login(user, res);
  }


  @Post('signup')
  async signUp(@Body() user: CreateUserDto, @Res() res: Response) {
    return await this.authService.createUser(user, res);
  }
}

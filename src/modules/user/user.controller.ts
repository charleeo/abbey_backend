import { Request, Response } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { UpdateUserService } from './services/update.service';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query() query: Request,
  ): Promise<Pagination<Users>> {
    return this.userService.paginate(query, req);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get('profile/:id')
  getProfile(@Param('id') uuid: string) {
    return this.userService.getProfile(uuid);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Put(':id/profile')
  async uploadKYCProfile(
    @Req() req,
    @Res() res: Response,
    @Param() params,
  ): Promise<Users> {
    return await this.updateUserService.uploadProfile(req, res, params);
  }

  @Post(':id/update')
  async updateProfile(
    @Body() user: UpdateUserDto,
    @Res() res: Response,
    @Param() params,
  ): Promise<Users> {
    return await this.updateUserService.updateProfile(user, res, params);
  }
}



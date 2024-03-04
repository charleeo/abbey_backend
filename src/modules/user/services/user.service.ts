import { instanceToPlain } from 'class-transformer';
import { IsNumber } from 'class-validator';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';
import { logData, logErrors } from 'src/common/helpers/logging';
import { responseStructure } from 'src/common/helpers/response.structure';

import { Injectable, Query, Req } from '@nestjs/common';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Users } from '../entities/user.entity';
import { UserRepository } from '../user.repository';

dotenv.config();
@Injectable()
export class UserService extends BaseDataSource {
  constructor(
    private usersRepository: UserRepository,
  ) {
    super(usersRepository);
  }

  async create(user: CreateUserDto): Promise<Users> {
    return await this.usersRepository.save(user);
  }

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Users> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ email });
  }

  getProfile(uuid: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ uuid });
  }

  async findOneWithRoles(email: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    return user
  
    
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async paginate(
    @Query() query: any,
    @Req() req: Request,
  ): Promise<Pagination<Users>> {
    //  let error:any=null
    let status = false;
    let message = '';
    let data: any = null;
    let error = 'There was an error';
    try {
      const page = query.page && IsNumber(query.page) ? query.page : 1;
      const limit = query.limit && IsNumber(query.limit) ? query.limit : 20;

      const qb = this.usersRepository.createQueryBuilder('u');

      qb.orderBy('u.id', 'DESC');

      data = await paginate<Users>(qb, {
        page,
        limit,
        route: process.env.APP_URL + 'user',
      });
      if (data['items'].length > 0) {
        message = 'Data found';
        status = true;
      }

      logData(data, req, message, 200, status);
    } catch (e) {
      error = e.message;
      logErrors(e.message);
    }
    return responseStructure(status, error ?? message, data);
  }

 
}

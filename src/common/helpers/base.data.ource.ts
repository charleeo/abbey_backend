import {  Request } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { paginate } from 'nestjs-typeorm-paginate';
import { Users } from 'src/modules/user/entities/user.entity';
import { FileUploadService } from 'src/modules/config/services/file.upload.service';
import { SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/modules/clients/loans/dto/pagination.dto';
import { instanceToPlain } from 'class-transformer';
import { Request  as ExpressRequest } from 'express';
import { PaginationOptions } from 'src/modules/clients/loans/dto/PaginationOptions';


export class BaseDataSource extends FileUploadService {
  constructor(public readonly repo?: any) {
    super();
  }

  /**
   * update an  entity depending on the provided conitions
   * @param condition
   * @param col
   * @param object
   */
  public async updateEntity(condition, col: string, object: object) {

    const entity = await this.repo
      .createQueryBuilder()
      .where(`${col} = :key`, { key: condition })
      .update({ ...object })
      .returning('*')
      .updateEntity(true)
      .execute();
    return entity.raw[0];
  }

  /**
   *
   * @param req Get the auth user
   * @returns
   */
  async getUser(@Request() req): Promise<Users> {
    return req.user;
  }

 async paginate<T>(qb: SelectQueryBuilder<any>, query: any,route?:string): Promise<any> {
    
    const pageQuery = query.page;
    const limit = query.per_page;

    const page =
      pageQuery && IsNumber(pageQuery) && pageQuery > 0 ? pageQuery : 1;
    const per_page = limit && IsNumber(limit) && limit > 0 ? limit : 20;

    return  await paginate<T>(qb, {
      page,
      limit: per_page,
      route
    });
   
  }

  async  findPaginatedData<T>({
    repository,
    req,
    route,
    query,
    order,
    relations,
    condition
}: PaginationOptions<T>): Promise<any> {
    
    const pageQuery:number = Number(query.page);
    const limit:number = Number(query.per_page);

    const page =
        pageQuery && Number.isInteger(pageQuery) && pageQuery > 0 ? pageQuery : 1;
    const per_page =
        limit && Number.isInteger(limit) && limit > 0 ? limit : 20;

    const [data, total] = await repository.findAndCount({
        skip: (page - 1) * per_page,
        take: per_page,
        order: order,
        relations:[...relations],
        relationLoadStrategy:'join',
        where: {...condition},
    });

    const totalPages = Math.ceil(total / per_page);

    const paginationDto = new PaginationDto<T>(data, total, page, per_page, totalPages);
    
     
    // const baseUrl = `${req.protocol}://${req.get('host')}${route}`;

    const paginationLinks = {
        first: `${route}?page=1&per_page=${per_page}`,
        last: `${route}?page=${totalPages}&per_page=${per_page}`,
        prev: page > 1 ? `${route}?page=${page - 1}&per_page=${per_page}` : null,
        next: page < totalPages ? `${route}?page=${page + 1}&per_page=${per_page}` : null
    };
   
    let plainObject  = instanceToPlain(paginationDto)

    return{
      items: plainObject.data,
      meta:{
        currentPage: plainObject.currentPage,
        totalItems: plainObject.total,
        itemCount : plainObject.data.length,
        itemsPerPage: plainObject.pageSize,
        totalPages: plainObject.totalPages
      },
      link:paginationLinks
    }
  }

  
}

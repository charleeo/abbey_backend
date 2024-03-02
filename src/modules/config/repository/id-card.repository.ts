import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { IdCards } from '../entities/Id-cards.entity';

@Injectable()
export class IdCardRepository extends Repository<IdCards> {
  constructor(private dataSource: DataSource) {
    super(IdCards, dataSource.createEntityManager());
  }
}

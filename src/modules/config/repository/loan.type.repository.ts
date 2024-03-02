import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { LoanType } from '../entities/loan.type.entity';

@Injectable()
export class LoanTypeRepository extends Repository<LoanType> {
  constructor(private dataSource: DataSource) {
    super(LoanType, dataSource.createEntityManager());
  }
}

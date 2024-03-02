import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LoanRepaymentDurationCategory } from '../entities/loans.category.entity';

@Injectable()
export class LoanRepaymentDurationCategoryRepository extends Repository<LoanRepaymentDurationCategory> {
  constructor(private dataSource: DataSource) {
    super(LoanRepaymentDurationCategory, dataSource.createEntityManager());
  }
}

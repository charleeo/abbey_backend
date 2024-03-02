import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LoanRepayment } from '../entities/loan.repayments.entity';

@Injectable()
export class LoanRepaymentRepository extends Repository<LoanRepayment> {
  constructor(private dataSource: DataSource) {
    super(LoanRepayment, dataSource.createEntityManager());
  }
}

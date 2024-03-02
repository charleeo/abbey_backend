import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Loan } from '../entities/loan.entity';

@Injectable()
export class LoanRepository extends Repository<Loan> {
  constructor(readonly dataSource: DataSource) {
    super(Loan, dataSource.createEntityManager());
  }
}

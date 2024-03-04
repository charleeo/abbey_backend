import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { MortGage } from '../entities/mortgage.entity';
import { LoanRepaymentPlan } from '../entities/loan.repayment.type.entity';


@Injectable()
export class LoanRepaymentPlanRepository extends Repository<LoanRepaymentPlan>
{
    constructor(private dataSource: DataSource)
    {
        super(LoanRepaymentPlan, dataSource.createEntityManager());
    }
}
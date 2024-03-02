import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LoanSetting } from '../entities/loan.settings.entity';

@Injectable()
export class LoanSettingRepository extends Repository<LoanSetting> {
  constructor(private dataSource: DataSource) {
    super(LoanSetting, dataSource.createEntityManager());
  }
}

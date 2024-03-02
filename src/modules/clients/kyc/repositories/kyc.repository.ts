import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { KYC } from '../entities/kyc.entity';



@Injectable()
export class KYCRepository extends Repository<KYC>
{
    constructor(private dataSource: DataSource)
    {
        super(KYC, dataSource.createEntityManager());
    }
}
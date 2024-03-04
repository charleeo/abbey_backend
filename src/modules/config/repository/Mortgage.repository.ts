import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { MortGage } from '../entities/mortgage.entity';


@Injectable()
export class MortgageRepository extends Repository<MortGage>
{
    constructor(private dataSource: DataSource)
    {
        super(MortGage, dataSource.createEntityManager());
    }
}
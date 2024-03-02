import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Duties } from '../entities/duties.entity';


@Injectable()
export class DutyRepository extends Repository<Duties>
{
    constructor(private dataSource: DataSource)
    {
        super(Duties, dataSource.createEntityManager());
    }
}
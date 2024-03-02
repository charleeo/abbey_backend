import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Actions } from '../entities/actions.entity';


@Injectable()
export class ActionRepository extends Repository<Actions>
{
    constructor(private dataSource: DataSource)
    {
        super(Actions, dataSource.createEntityManager());
    }
}
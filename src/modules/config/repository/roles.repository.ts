import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Roles } from '../entities/roles.entity';


@Injectable()
export class RoleRepository extends Repository<Roles>
{
    constructor(private dataSource: DataSource)
    {
        super(Roles, dataSource.createEntityManager());
    }
}
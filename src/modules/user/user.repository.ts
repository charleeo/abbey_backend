import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';

import { Users } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<Users>
{
    constructor(private dataSource: DataSource)
    {
        super(Users, dataSource.createEntityManager());
    }
}
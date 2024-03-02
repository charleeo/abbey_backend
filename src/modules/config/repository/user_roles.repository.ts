import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { UserRoles } from '../entities/user.role.entity';


@Injectable()
export class UserRoleRepository extends Repository<UserRoles>
{
    constructor(private dataSource: DataSource)
    {
        super(UserRoles, dataSource.createEntityManager());
    }
}
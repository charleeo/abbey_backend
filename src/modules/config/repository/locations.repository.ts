import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Locations } from '../entities/location.entity';


@Injectable()
export class LocationRepository extends Repository<Locations>
{
    constructor(private dataSource: DataSource)
    {
        super(Locations, dataSource.createEntityManager());
    }
}
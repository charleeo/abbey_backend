import { PrimaryGeneratedColumn, Column, Entity, Generated} from "typeorm";

@Entity()
export class Duties
{
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number

    @Column()
    @Generated("uuid")
    uuid: string

    @Column({type:"varchar",length:225,unique:true})
    name:string
}
import { Status } from "src/modules/entities/common.type";
import { Users } from "src/modules/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn,OneToOne,JoinColumn, Generated} from "typeorm";

@Entity()
export class UserRoles
{
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number

    @Column()
    @Generated("uuid")
    uuid: string

    @Column({type:"int",unsigned:true})
    roleId:number
    
    @Column({type:"json"})
    actions:string

    @Column({type:"int",unsigned:true})
    dutyId:number

    @Column({
        type: "enum",
        enum: Status,
        default: Status.active,
        comment:"1 means active status. O means inactive status"
    })
    status: Status

    @OneToOne(() => Users, user=>user.role)
    @JoinColumn()
    user:number

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date

}
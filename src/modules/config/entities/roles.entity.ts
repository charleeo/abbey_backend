
import { 
    Entity ,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Generated
} from "typeorm"


@Entity()

export class Roles{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @Generated("uuid")
    uuid: string
    
    @Column({type:"varchar",length:225})
    role_name:string

    @Column({type:"varchar",length:225,unique:true})
    role:string

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date
}
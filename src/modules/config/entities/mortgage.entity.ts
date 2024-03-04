
import { 
    Entity ,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Generated
} from "typeorm"


@Entity({name:'mortgages'})

export class MortGage{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @Generated("uuid")
    uuid: string
    
    @Column({type:"varchar",length:225, unique:true})
    name:string

    @Column({type:"varchar",length:30})
    repayment_status:string

    @Column({type:"varchar",length:30})
    status:string

    @Column({type:"varchar",length:30})
    interest : string

    @Column({type:"varchar",length:30, default:'start'})
    life_cycle : string

    @Column({ type: 'decimal', default: 0.0, precision: 15, scale: 2 })
    price: number;

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date
}
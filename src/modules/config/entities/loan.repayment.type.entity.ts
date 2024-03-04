
import { 
    Entity ,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Generated
} from "typeorm"


@Entity({name:'loan_repayment_types'})

export class LoanRepaymentPlan{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @Generated("uuid")
    uuid: string
    
    @Column({type:"varchar",length:225, unique:true})
    name:string

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date
}
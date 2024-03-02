import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Generated,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Loan } from './loan.entity';
import { RepaymentStatus } from 'src/modules/entities/common.type';

@Entity()
export class LoanRepayment {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'decimal', default: 0.0, precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Loan, user => user.repayments)
  @JoinColumn({name:'loan_id'})
  loan:  Loan

  @Column({ type: 'varchar', nullable: true })
  repayment_reference: string;

  @Column({ 
    type: 'enum',
    default: RepaymentStatus.pending,
    enum : RepaymentStatus
    })
  confirmation_status: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'jsonb', default: {} })
  repayments_data: object;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false,  })
  isDeleted: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt:Date
}

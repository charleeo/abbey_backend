import { LoanType } from 'src/modules/config/entities/loan.type.entity';
import { LoanRepaymentDurationCategory } from 'src/modules/config/entities/loans.category.entity';
import {
  ApprovalStatus,
  InterestPaymentStatus,
} from 'src/modules/entities/common.type';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LoanRepayment } from './loan.repayments.entity';

@Entity({ name: 'loans' })
export class Loan {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => LoanRepaymentDurationCategory)
  @JoinColumn({ name: 'loan_duration_category' }) 
  loan_duration_category: LoanRepaymentDurationCategory;

  @ManyToOne(() => LoanType)
  @JoinColumn({ name: 'loan_type' }) 
  loan_type:LoanType

   @OneToMany(() => LoanRepayment, repayment => repayment.loan,{eager:true})
  repayments: LoanRepayment[] ;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'decimal', default: 0.0, precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', default: 0.0, precision: 10, scale: 2 })
  interest: number;

  @Column({ type: 'decimal', default: 0.0, precision: 10, scale: 2 })
  repayment_sum: number;

  @Column({
    type: 'decimal',
    default: 0.0,
    precision: 10,
    scale: 2,
    comment: 'the loaned amount plus the loan interest',
  })
  expected_repayment_amount: number;

  @Column({ type: 'varchar', default: 0 })
  repayment_rate: number;

  @Column({ type: 'varchar', default: '0%' })
  repayment_percentage: string;

  @Column({ type: 'varchar', default: 0 })
  repayment_intervals: number;

  @Column({ type: 'date', default: null })
  repayment_due_date: Date;

  @Column({ type: 'date', default: null })
  repayment_start_date: Date;

  @Column({ type: 'date', default: null })
  issue_date: Date;

  @Column({ type: 'varchar' })
  reference: string;

  @Column({ type: 'text', nullable:true })
  comment: string;

  @Column({
    type: 'enum',
    default: ApprovalStatus.pending,
    enum: ApprovalStatus,
  })
  verification_status: ApprovalStatus;

  @Column({
    type: 'enum',
    default: InterestPaymentStatus.paid_upfront,
    enum: InterestPaymentStatus,
  })
  interest_payment_status: InterestPaymentStatus;

  @CreateDateColumn()
  created_at: Date;
  
  @UpdateDateColumn()
  updated_at: Date;

   @DeleteDateColumn()
  deletedAt:Date
}

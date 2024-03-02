import { Loan } from 'src/modules/clients/loans/entities/loan.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Generated,
} from 'typeorm';

@Entity({ name: 'loan_repayment_duration_categoriess' })
export class LoanRepaymentDurationCategory {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 225, unique: true })
  category_name: string;

  @Column({ type: 'varchar', length: 225, unique: true })
  category_tagline: string;

  @OneToMany(() => Loan, (loan) => loan.loan_duration_category, {eager:true})
  loans: Loan[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

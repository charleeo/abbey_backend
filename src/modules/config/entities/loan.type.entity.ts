import { Loan } from 'src/modules/clients/loans/entities/loan.entity';
import { PrimaryGeneratedColumn, Column, Entity, Generated, OneToMany } from 'typeorm';

@Entity({ name: 'loan_types' })
export class LoanType {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 225, unique: true })
  type: string;

  @Column({ type: 'varchar', length: 225 })
  description: string;

  @Column({ type: 'varchar', length: 225 })
  status: string;
  
  @OneToMany(() => Loan, (loan) => loan.loan_type,{eager:true})
  loans: Loan[];
}

import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LoanSetting {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'int' })
  client_id: number;

  @Column({ nullable: true })
  @Exclude()
  application_password: string;

  @Column({ nullable: true })
  receiving_account: string;

  @Column({ nullable: true })
  receiving_bank: string;

  @Column({ type: 'int', nullable: true })
  default_loan_type: number;
}

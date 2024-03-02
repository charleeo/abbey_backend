import {
  Gender,
  KYCLevel,
  VerificationEnums,
} from 'src/modules/entities/common.type';
import { Users } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class KYC {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    unique: true,
    type: 'varchar',
    comment: "the client's bank verification number",
    nullable: true,
  })
  bvn: string;

  @Column({ unique: false, type: 'varchar', nullable: true })
  phone: string;

  @Column({
    unique: true,
    type: 'varchar',
    comment: 'User national identity number',
    nullable: true,
  })
  nin: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
    nullable: true,
  })
  gender: Gender;

  @Column({ length: 225 })
  firstname: string;

  @Column({ length: 225, nullable: true })
  lastname: string;

  @Column({ type: 'text', comment: 'Business or house address' })
  address: string;

  @Column({
    type: 'enum',
    enum: VerificationEnums,
    comment:
      'verified is verified and no is not verified, review is when it is under review',
    default: VerificationEnums.pending,
  })
  kyc_verification_status: VerificationEnums;

  @Column({
    type: 'enum',
    enum: KYCLevel,
    comment: 'All newly created users will be on level one untill verified',
    default: KYCLevel.level_one,
  })
  kyc_level: KYCLevel;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  id_card: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  id_card_type: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @Column({ unique: true })
  user_id: number;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

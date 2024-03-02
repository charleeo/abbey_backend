import { Exclude } from 'class-transformer';
import { KYC } from 'src/modules/clients/kyc/entities/kyc.entity';
import { UserRoles } from 'src/modules/config/entities/user.role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  firstname: string;

  @Column({ nullable: true, type: 'varchar', unique: true })
  username: string;

  @Column({ nullable: true, type: 'varchar' })
  lastname: string;

  @Column({
    nullable: true,
    type: 'varchar',
    default: 'images/no_image.png',
  })
  profile_picture: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'bool', default: false })
  is_admin: boolean;

  @OneToOne(() => UserRoles, (role) => role.user)
  role: UserRoles;

  @OneToOne(() => KYC, (kyc) => kyc.user)
  kyc: KYC;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

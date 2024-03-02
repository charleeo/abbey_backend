import { PrimaryGeneratedColumn, Column, Entity, Generated } from 'typeorm';

@Entity()
export class Actions {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 225 })
  actions: string;

  @Column({ type: 'varchar', length: 225, unique: true })
  tag_line: string;
}

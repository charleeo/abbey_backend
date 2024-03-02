import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity('id_cards')
export class IdCards {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 225, unique: true })
  name: string;
}

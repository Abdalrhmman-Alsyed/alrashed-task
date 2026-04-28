import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 20 })
  type!: string;

  @Column({ length: 255 })
  street!: string;

  @Column({ length: 100 })
  city!: string;

  @Column({ length: 100 })
  state!: string;

  @Column({ length: 20 })
  zip_code!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

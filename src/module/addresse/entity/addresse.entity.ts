import { Order } from '../../order/entity/order.entity';
import { User } from '../../user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
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

  @OneToOne(() => User, (user) => user.address)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Order, (order) => order.address)
  orders!: Order[];
}

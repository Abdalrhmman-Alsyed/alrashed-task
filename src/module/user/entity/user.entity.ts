import { Order } from '../../order/entity/order.entity';
import { Address } from '../../addresse/entity/addresse.entity';
import { Review } from '../../review/entity/review.entity';
import { Notification } from '../../notification/entity/notification.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column({ default: false })
  is_verified!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne(() => Address, (address) => address.user)
  address!: Address;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];
}

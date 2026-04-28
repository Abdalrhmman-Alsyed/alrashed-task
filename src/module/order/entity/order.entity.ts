import { Address } from '../../addresse/entity/addresse.entity';
import { User } from '../../user/entity/user.entity';
import { OrderItem } from '../../order_item/entity/order_item.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 30 })
  status!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Address, (address) => address.orders)
  @JoinColumn({ name: 'address_id' })
  address!: Address;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];
}

import { OrderItem } from '../../order_item/entity/order_item.entity';
import { Product } from '../../product/entity/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  sku!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column()
  stock_quantity!: number;

  @Column({ type: 'json', nullable: true })
  attributes!: any;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @OneToMany(() => OrderItem, (item) => item.variant)
  orderItems!: OrderItem[];
}

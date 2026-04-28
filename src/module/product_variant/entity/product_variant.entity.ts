import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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
}

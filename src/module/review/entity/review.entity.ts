import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

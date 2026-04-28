import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ length: 20 })
  type!: string;

  @Column({ default: false })
  is_read!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

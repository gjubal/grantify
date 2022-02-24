import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import Grant from './Grant';

@Entity('expenses')
export default class Expense extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', nullable: true })
  lineItemCode: number;

  @Column({ type: 'decimal', nullable: true })
  budget: number;

  @Column({ type: 'decimal', nullable: true })
  amountSpent: number;

  @Column()
  date: string;

  @Column()
  grantId: string;

  @ManyToOne(() => Grant, grant => grant.expenses)
  grant: Grant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

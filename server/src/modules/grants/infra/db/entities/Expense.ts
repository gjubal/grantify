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

  @Column({ unique: true })
  name: string;

  @Column({ type: 'decimal' })
  totalBudget: number;

  @Column({ type: 'decimal' })
  balanceRemaining: number;

  @Column()
  grantId: string;

  @ManyToOne(() => Grant, grant => grant.expenses)
  grant: Grant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

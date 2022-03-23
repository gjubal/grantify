import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import Attachment from './Attachment';
import Expense from './Expense';

@Entity('grants')
export default class Grant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  grantName: string;

  @Column({ type: 'timestamp with time zone' })
  openDate: Date;

  @Column({ type: 'timestamp with time zone' })
  closeDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dateWhenFundsWereReceived: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: Date;

  @Column()
  status: string;

  @Column({ type: 'decimal' })
  amountRequested: number;

  @Column({ type: 'decimal', nullable: true })
  amountApproved: number;

  @Column({ nullable: true })
  writerName: string;

  @Column({ nullable: true })
  applicationUrl: string;

  @Column({ nullable: true })
  sponsoringAgency: string;

  @OneToMany(() => Expense, expense => expense.grant)
  expenses: Expense[];

  @OneToMany(() => Attachment, attachment => attachment.grant)
  attachments: Attachment[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

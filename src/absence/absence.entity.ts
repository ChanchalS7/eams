import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum AbsenceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class AbsenceRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true })
  employee!: User;

  @Column('date')
  startDate!: Date;
  @Column('date')
  endDate!: Date;
  @Column()
  reason!: string;

  @Column({ type: 'varchar', enum: AbsenceStatus, default: AbsenceStatus.PENDING })
  status!: AbsenceStatus;

  @CreateDateColumn()
  createdAt!: Date;
}

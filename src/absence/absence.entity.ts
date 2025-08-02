import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum AbsenceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class AbsenceRequest {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => User, { eager: true }) employee: User;

  @Column() startDate: Date;
  @Column() endDate: Date;
  @Column() reason: string;

  @Column({ type: 'enum', enum: AbsenceStatus, default: AbsenceStatus.PENDING })
  status: AbsenceStatus;

  @CreateDateColumn() createdAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() name: string;

  @Column({ unique: true }) email: string;

  @Column({ type: 'enum', enum: Role }) role: Role;
}

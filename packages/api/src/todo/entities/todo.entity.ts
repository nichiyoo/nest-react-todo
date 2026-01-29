import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TodoStatus {
  CREATED = 'created',
  COMPLETED = 'completed',
  ON_GOING = 'on_going',
  PROBLEM = 'problem',
}

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'varchar', default: TodoStatus.CREATED })
  status: TodoStatus;

  @Column({ nullable: true })
  problemDesc?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

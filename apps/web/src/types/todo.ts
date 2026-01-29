import { TodoStatus } from './status';

export interface Todo {
  id: number;
  title: string;
  status: TodoStatus;
  problem_desc?: string;
  createdAt: string;
}

export interface CreateTodoDto {
  title: string;
  status?: TodoStatus;
  problem_desc?: string;
}

export interface UpdateTodoDto {
  status?: TodoStatus;
  problem_desc?: string;
}

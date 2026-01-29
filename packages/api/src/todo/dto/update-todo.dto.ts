import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class UpdateTodoDto {
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @IsString()
  @IsOptional()
  problemDesc?: string;
}

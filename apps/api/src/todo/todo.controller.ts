import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '@repo/api';

@Controller('api/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return await this.todoService.findAll(search);
  }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return await this.todoService.create(createTodoDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return await this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Todo> {
    return await this.todoService.remove(+id);
  }
}

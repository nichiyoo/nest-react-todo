import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Todo, CreateTodoDto, UpdateTodoDto } from '@repo/api';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(search?: string): Promise<Todo[]> {
    if (search) {
      return this.todoRepository.find({
        where: {
          title: Like(`%${search}%`),
        },
        order: {
          createdAt: 'DESC',
        },
      });
    }
    return this.todoRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Todo | null> {
    return this.todoRepository.findOneBy({ id });
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = new Todo();
    todo.title = createTodoDto.title;
    return this.todoRepository.save(todo);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new Error('Todo not found');
    }

    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new Error('Todo not found');
    }

    await this.todoRepository.delete(id);
    return todo;
  }
}

import { instance } from '../libs/axios';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';

export const todoService = {
  getTodos: async (search?: string) => {
    const params = search ? { search } : {};
    const { data } = await instance.get<{ data: Todo[] }>('/api/todos', {
      params,
    });
    return data;
  },

  createTodo: async (todo: CreateTodoDto) => {
    const { data } = await instance.post<Todo>('/api/todos', todo);
    return data;
  },

  updateTodo: async (id: number, todo: UpdateTodoDto) => {
    const { data } = await instance.patch<Todo>(`/api/todos/${id}`, todo);
    return data;
  },

  getTodoById: async (id: number) => {
    const { data } = await instance.get<Todo>(`/api/todos/${id}`);
    return data;
  },
};

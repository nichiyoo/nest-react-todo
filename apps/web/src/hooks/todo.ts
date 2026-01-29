import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

import { todoService } from '../services/todo';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';

const STALE = 1000 * 60;

export const useTodos = (search?: string): UseQueryResult<Todo[], Error> => {
  return useQuery({
    queryKey: ['todos', search],
    queryFn: async () => {
      const response = await todoService.getTodos(search);
      return Array.isArray(response) ? response : response.data;
    },
    staleTime: STALE,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoDto) => todoService.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoDto }) => {
      return todoService.updateTodo(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoService.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

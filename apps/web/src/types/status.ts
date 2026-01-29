export const STATUS = {
  CREATED: 'created',
  COMPLETED: 'completed',
  ON_GOING: 'on_going',
  PROBLEM: 'problem',
} as const;

export type TodoStatus = (typeof STATUS)[keyof typeof STATUS];

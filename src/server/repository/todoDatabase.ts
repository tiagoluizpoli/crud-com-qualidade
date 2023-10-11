import prisma from '@/lib/prisma';
import { HttpNotFoundError } from '../infra';
import { Todo, TodoSchema } from '../schema';

// interface Todo {
//   id: string;
//   content: string;
//   date: Date;
//   done: boolean;
// }

interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}
const get = async ({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> => {
  const count = await prisma.todo.count();
  const allTodos = await prisma.todo.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  const parsedTodos = TodoSchema.array().safeParse(allTodos);
  if (!parsedTodos.success) {
    throw parsedTodos.error;
  }

  const resp = {
    total: parsedTodos.data.length,
    pages: Math.ceil(count / limit),
    todos: parsedTodos.data,
  };

  return resp;
};

const createContent = async (content: string): Promise<Todo> => {
  const newTodo = await prisma.todo.create({
    data: {
      content: content,
    },
  });
  return newTodo;
};

const toggleDone = async (id: string): Promise<Todo> => {
  const currentStateTodo = await prisma.todo.findFirst({
    where: {
      id,
    },
  });
  if (!currentStateTodo) {
    throw new Error('Todo not found');
  }
  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: {
      done: !currentStateTodo?.done,
    },
  });

  return updatedTodo;
};

const deleteById = async (id: string) => {
  const deleted = await prisma.todo.delete({
    where: {
      id,
    },
  });
  if (!deleted) {
    throw new HttpNotFoundError(`Todo with id "${id}" not found`);
  }
  return deleted;
};
export const todoRepository = {
  get,
  createContent,
  toggleDone,
  deleteById,
};

import { PrismaClient } from '@prisma/client';
import { HttpNotFoundError } from '../infra';

const prisma = new PrismaClient();

interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}

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
  const allTodos = await prisma.todo.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    total: allTodos.length,
    pages: Math.ceil(allTodos.length / limit),
    todos: allTodos,
  };
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

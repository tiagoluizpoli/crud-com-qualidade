import { read, create, update } from '@/db-crud-todo';

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

const get = ({ page, limit }: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput => {
  const currentPage = page || 2;
  const currentLimit = limit || 2;
  const allTodos = read().reverse();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTudos = allTodos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allTodos.length / currentLimit);
  return {
    total: allTodos.length,
    pages: totalPages,
    todos: paginatedTudos,
  };
};

const createContent = async (content: string): Promise<Todo> => {
  const newTodo = await create(content);
  return newTodo;
};

const toggleDone = async (id: string): Promise<Todo> => {
  const allTodos = read();
  const todo = allTodos.find((todo) => todo.id === id);

  if (!todo) throw new Error(`Todo with id "${id}" not found`);

  const updatedTodo = await update(todo.id, {
    done: !todo.done,
  });

  return updatedTodo;
};

export const todoRepository = {
  get,
  createContent,
  toggleDone,
};

// Model
interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}

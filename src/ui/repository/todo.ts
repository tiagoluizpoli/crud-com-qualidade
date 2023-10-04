import { Todo, TodoSchema } from '@/ui/schema';
import { z } from 'zod';

interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

const get = ({ page, limit }: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> => {
  return fetch(`/api/todos?page=${page}&limit=${limit}`).then(async (succ) => {
    const todoString = await succ.text();
    const { todos, pages, total } = parseTodosFromServer(JSON.parse(todoString));

    return {
      todos,
      total,
      pages,
    };
  });
};

const create = async (content: string) => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      // mime type
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
    }),
  });
  if (response.ok) {
    const serverResponse = await response.json();
    const ServerResponseSchema = z.object({
      todo: TodoSchema,
    });
    const serverResponseParsed = ServerResponseSchema.safeParse(serverResponse);

    if (!serverResponseParsed.success) {
      throw new Error('Failed to create Todo :(');
    }

    const todo = serverResponseParsed.data.todo;
    return todo;
  }

  throw new Error('Failed to create Todo :(');
};

const toggleDone = async (id: string) => {
  const response = await fetch(`/api/todos/${id}/toggle-done`, {
    method: 'PUT',
  });
  if (response.ok) {
    const serverResponse = await response.json();
    const ServerResponseSchema = z.object({
      todo: TodoSchema,
    });
    const serverResponseParsed = ServerResponseSchema.safeParse(serverResponse);
    if (!serverResponseParsed.success) {
      throw new Error(`Failed to update Todo with id ${id}`);
    }
    const updatedTodo = serverResponseParsed.data.todo;
    return updatedTodo;
  }
  throw new Error('Server Error');
};
export const todoRepository = {
  get,
  create,
  toggleDone,
};

// interface Todo {
//     id: string
//     content: string
//     date: Date
//     done: boolean
// }

function parseTodosFromServer(responseBody: unknown): {
  todos: Array<Todo>;
  total: number;
  pages: number;
} {
  if (
    responseBody !== null &&
    typeof responseBody === 'object' &&
    'todos' in responseBody &&
    'total' in responseBody &&
    'pages' in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.pages),
      todos: responseBody.todos.map((todo: unknown) => {
        if (todo === null && typeof todo !== 'object') {
          throw new Error('Invalid todo from API');
        }
        const { id, content, date, done } = todo as {
          id: string;
          content: string;
          date: string;
          done: string;
        };
        return {
          id,
          content,
          done: Boolean(done),
          date: date,
        };
      }),
    };
  }
  return {
    todos: [],
    pages: 1,
    total: 0,
  };
}

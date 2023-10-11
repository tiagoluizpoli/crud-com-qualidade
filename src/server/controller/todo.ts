import { todoRepository } from '../repository';
import { z } from 'zod';
import { HttpNotFoundError } from '../infra';
import { NextResponse } from 'next/server';

const TodoCreateBodySchema = z.object({
  content: z.string(),
});
const create = async (req: Request) => {
  const parsedBody = TodoCreateBodySchema.safeParse(await req.json());
  if (!parsedBody.success) {
    return new NextResponse(
      JSON.stringify({
        message: 'an error has occurred',
        error: parsedBody.error,
      }),
      {
        status: 400,
      },
    );
  }
  const createdTodo = await todoRepository.createContent(
    parsedBody.data.content,
  );
  return new NextResponse(
    JSON.stringify({
      todo: createdTodo,
    }),
    {
      status: 201,
    },
  );
};

const get = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
  };
  const page = Number(query.page);
  const limit = Number(query.limit);
  if (query.page && isNaN(page)) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message: '`Page` must be a number',
        },
      }),
      {
        status: 400,
      },
    );
  }
  if (query.limit && isNaN(limit)) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message: '`Limit` must be a number',
        },
      }),
      {
        status: 400,
      },
    );
  }
  try {
    const output = await todoRepository.get({
      limit,
      page,
    });

    return new NextResponse(
      JSON.stringify({
        total: output.total,
        pages: output.pages,
        todos: output.todos,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message: 'failed to get todos',
          details: error,
        },
      }),
      {
        status: 400,
      },
    );
  }
};

const toggleDone = async (req: Request, todoId: string) => {
  if (!todoId || typeof todoId !== 'string') {
    return new Response(
      JSON.stringify({
        error: {
          message: 'you must provide a string id',
        },
      }),
      { status: 400 },
    );
  }
  try {
    const updatedTodo = await todoRepository.toggleDone(todoId);
    return new Response(
      JSON.stringify({
        todo: updatedTodo,
      }),
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        }),
        { status: 404 },
      );
    }
  }
};
const deleteById = async (req: Request, id: string) => {
  const query = {
    todoId: id,
  };
  const QuerySchema = z.object({
    todoId: z.string().uuid(),
  });

  // TODO Validate query schema
  const parsedQuery = QuerySchema.safeParse(query);
  if (!parsedQuery.success) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'you must provide a valid id',
        },
      }),
      {
        status: 400,
      },
    );
  }

  const { todoId } = parsedQuery.data;

  try {
    await todoRepository.deleteById(todoId as string);
    return new Response(undefined, {
      status: 204,
    });
  } catch (error) {
    if (error instanceof HttpNotFoundError) {
      return new Response(
        JSON.stringify({
          error: {
            cause: error.cause,
            name: error.name,
            message: error.message,
          },
        }),
        {
          status: error.status || 400,
        },
      );
    }
    return new Response(
      JSON.stringify({
        error: {
          message: `Internal server error`,
        },
      }),
      {
        status: 500,
      },
    );
  }
};
export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};

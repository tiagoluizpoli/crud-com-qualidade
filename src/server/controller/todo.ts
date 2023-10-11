import { NextApiRequest, NextApiResponse } from 'next';
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
};

const toggleDone = async (req: NextApiRequest, res: NextApiResponse) => {
  const todoId = req.query.id;
  if (!todoId || typeof todoId !== 'string') {
    res.status(400).json({
      error: {
        message: 'you must provide a string id',
      },
    });
    return;
  }
  try {
    const updatedTodo = await todoRepository.toggleDone(todoId);

    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({
        error: {
          message: error.message,
        },
      });
    }
  }
};
const deleteById = async (req: NextApiRequest, res: NextApiResponse) => {
  const QuerySchema = z.object({
    id: z.string().uuid().nonempty(),
  });

  // TODO Validate query schema
  const parsedQuery = QuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({
      error: {
        message: 'you must provide a valid id',
      },
    });
  }

  const { id } = parsedQuery.data;

  try {
    await todoRepository.deleteById(id as string);
    res.status(204).end();
  } catch (error) {
    if (error instanceof HttpNotFoundError) {
      res.status(error.status).json({
        error: {
          cause: error.cause,
          name: error.name,
          message: error.message,
        },
      });
      return;
    }
    res.status(500).json({
      error: {
        message: `Internal server error`,
      },
    });
  }
};
export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};

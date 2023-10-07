import { NextApiRequest, NextApiResponse } from 'next';
import { todoRepository } from '../repository';
import { z } from 'zod';
import { HttpNotFoundError } from '../infra';

const TodoCreateBodySchema = z.object({
  content: z.string(),
});
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const parsedBody = TodoCreateBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      message: 'an error has occurred',
      error: parsedBody.error,
    });
    return;
  }
  const createdTodo = await todoRepository.createContent(
    parsedBody.data.content,
  );
  res.status(201).json({
    todo: createdTodo,
  });
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);
  if (query.page && isNaN(page)) {
    res.status(400).json({
      error: {
        message: '`Page` must be a number',
      },
    });
    return;
  }
  if (query.limit && isNaN(limit)) {
    res.status(400).json({
      error: {
        message: '`Limit` must be a number',
      },
    });
    return;
  }
  const output = await todoRepository.get({
    limit,
    page,
  });

  res.status(200).json(output);
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

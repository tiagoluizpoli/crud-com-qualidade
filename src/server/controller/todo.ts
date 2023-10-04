import { NextApiRequest, NextApiResponse } from 'next';
import { todoRepository } from '../repository';
import { z } from 'zod';

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
  const createdTodo = await todoRepository.createContent(parsedBody.data.content);
  res.status(201).json({
    todo: createdTodo,
  });
};

const get = (req: NextApiRequest, res: NextApiResponse) => {
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
  const output = todoRepository.get({
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
export const todoController = {
  get,
  create,
  toggleDone,
};

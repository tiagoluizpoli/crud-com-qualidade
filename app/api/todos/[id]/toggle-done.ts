import { todoController } from '@/server/controller';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'PUT') {
    await todoController.toggleDone(request, response);
    return;
  }
  response.status(405).json({
    error: {
      message: 'Method not allowed',
    },
  });
};

export default handler;

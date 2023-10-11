import { todoController } from '@/server/controller';
export const GET = async (request: Request) => {
  return await todoController.get(request);
};

export const POST = async (request: Request) => {
  return await todoController.create(request);
};

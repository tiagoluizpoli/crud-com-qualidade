import { todoController } from '@/server/controller';

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  return await todoController.toggleDone(request, params.id);
};

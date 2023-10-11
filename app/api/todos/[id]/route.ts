import { todoController } from '@/server/controller';

export const GET = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const id = params.id;
  return new Response(
    JSON.stringify({
      message: `I'm the id ${id}`,
    }),
  );
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const id = params.id;
  return await todoController.deleteById(request, id);
};

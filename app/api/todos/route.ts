import { todoController } from '@/server/controller';
export const GET = async (request: Request) => {
  return await todoController.get(request);
};

export const POST = async (request: Request) => {
  await todoController.create(request);
};

// import { NextApiRequest, NextApiResponse } from 'next';

// const handler = async (request: NextApiRequest, response: NextApiResponse) => {
//   if (request.method === 'GET') {
//     return;
//   }

//   if (request.method === 'POST') {
//     return;
//   }
//   response.status(405).json({
//     error: {
//       message: 'Method not allowed',
//     },
//   });
// };
// export default handler;

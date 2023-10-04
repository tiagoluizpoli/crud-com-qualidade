import { NextApiRequest, NextApiResponse } from 'next';

const handler = (request: NextApiRequest, response: NextApiResponse) => {
  // eslint-disable-next-line no-console
  console.log(request.headers);
  response.status(200).json({
    message: 'Hello World',
  });
};

export default handler;

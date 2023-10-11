export const GET = async () => {
  return new Response(
    JSON.stringify({ route: '/api', message: 'Hello World' }),
    {
      status: 200,
    },
  );
};

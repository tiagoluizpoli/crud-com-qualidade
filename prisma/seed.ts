import prisma from '@/lib/prisma';

async function main() {
  const id1 = '2c8ca3f4-7734-44ec-9c89-e288a01d4b16';
  const newTodo1 = await prisma.todo.upsert({
    where: { id: id1 },
    update: {
      content: 'new Todo 1',
    },
    create: {
      id: id1,
      content: 'new Todo 1',
    },
  });

  const id2 = 'ea6a0dcd-e9de-45e7-93df-bb81a7d4f4de';
  const newTodo2 = await prisma.todo.upsert({
    where: { id: id2 },
    update: {},
    create: {
      id: id2,
      content: 'new Todo 2',
    },
  });

  const id3 = '554af935-60b6-4e26-a794-f555b5aeb2c6';
  const newTodo3 = await prisma.todo.upsert({
    where: { id: id3 },
    update: {},
    create: {
      id: id3,
      content: 'new Todo 3',
    },
  });

  // eslint-disable-next-line no-console
  console.log({
    newTodo1,
    newTodo2,
    newTodo3,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });

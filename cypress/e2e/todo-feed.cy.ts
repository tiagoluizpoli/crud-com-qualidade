const BASE_URL = 'http://localhost:3000';

describe('todo feed', () => {
  it('should render the page on load', () => {
    cy.visit(BASE_URL);
  });
  it('shoud appear in the screen when creating a new todo', () => {
    // 0 - Interceptors
    cy.intercept('POST', `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: '74d9eb3f-49ff-4d26-85d7-793f97284967',
            date: '2023-10-06T04:07:28.508Z',
            content: 'Test todo',
            done: false,
          },
        },
      });
    }).as('createTodo');

    // 1 - Abrir a pagina
    cy.visit('http://localhost:3000');
    // 2 - Selecionar o input de criar nova tudo
    // 3 - Digitar no input de criar nova todo

    cy.get('input[name="add-todo"]').type('Test todo');

    // 4 - Clicar no botão
    cy.get('button[aria-label="Adicionar novo item"]').click();
    // 5 - Checar se na página surgiu um novo elemento
    cy.get('table > tbody').contains('Test todo');

    expect('texto').to.be.equal('texto');
  });
});

interface TodoRepositoryGetParams {
    page: number
    limit: number
}

interface TodoRepositoryGetOutput {
    todos: Todo[]
    total: number
    pages: number
}

async function get({
    page,
    limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
    return fetch('/api/todos').then(async (succ) => {
        const todoString = await succ.text()
        const todosFromServer = parseTodosFromServer(
            JSON.parse(todoString)
        ).todos
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const paginatedTudos = todosFromServer.slice(startIndex, endIndex)
        const totalPages = Math.ceil(todosFromServer.length / limit)

        return {
            todos: paginatedTudos,
            total: todosFromServer.length,
            pages: totalPages,
        }
    })
}

export const todoRepository = {
    get,
}

interface Todo {
    id: string
    content: string
    date: Date
    done: boolean
}

function parseTodosFromServer(responseBody: unknown) {
    if (
        responseBody !== null &&
        typeof responseBody === 'object' &&
        'todos' in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo === null && typeof todo !== 'object') {
                    throw new Error('Invalid todo from api')
                }
                const { id, content, date, done } = todo as {
                    id: string
                    content: string
                    date: string
                    done: string
                }
                return {
                    id,
                    content,
                    done: Boolean(done),
                    date: new Date(date),
                }
            }),
        }
    }
    return {
        todos: [],
    }
}

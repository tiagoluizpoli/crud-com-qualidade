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
    return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
        async (succ) => {
            const todoString = await succ.text()
            const { todos, pages, total } = parseTodosFromServer(
                JSON.parse(todoString)
            )

            return {
                todos,
                total,
                pages,
            }
        }
    )
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

function parseTodosFromServer(responseBody: unknown): {
    todos: Array<Todo>
    total: number
    pages: number
} {
    if (
        responseBody !== null &&
        typeof responseBody === 'object' &&
        'todos' in responseBody &&
        'total' in responseBody &&
        'pages' in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo === null && typeof todo !== 'object') {
                    throw new Error('Invalid todo from API')
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
        pages: 1,
        total: 0,
    }
}

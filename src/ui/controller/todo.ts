import { todoRepository } from '../repository/todo'
import { v4 as uuid } from 'uuid'

interface TodoControllerGetParams {
    page: number
}
interface TodoControllerCreateParams {
    content: string
    onError: () => void

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (todo: any) => void
}
const create = async ({
    content,
    onError,
    onSuccess,
}: TodoControllerCreateParams) => {
    // Fail fast
    if (!content) {
        onError()
    }
    const todo = {
        id: uuid(),
        content,
        date: new Date(),
        done: false,
    }
    onSuccess(todo)
}

async function get({ page }: TodoControllerGetParams) {
    return todoRepository.get({ page: page || 1, limit: 10 })
}

function filterByContent<Todo>(
    search: string,
    todos: Array<Todo & { content: string }>
) {
    const homeTodos = todos.filter((todo) => {
        return todo.content.toLowerCase().includes(search.toLowerCase())
    })
    return homeTodos
}
export const todoController = {
    get,
    filterByContent,
    create,
}

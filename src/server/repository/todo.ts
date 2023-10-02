import { read } from '@/db-crud-todo'

interface TodoRepositoryGetParams {
    page?: number
    limit?: number
}
interface TodoRepositoryGetOutput {
    todos: Todo[]
    total: number
    pages: number
}

function get({
    page,
    limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
    const currentPage = page || 2
    const currentLimit = limit || 2
    const allTodos = read()

    const startIndex = (currentPage - 1) * currentLimit
    const endIndex = currentPage * currentLimit
    const paginatedTudos = allTodos.slice(startIndex, endIndex)
    const totalPages = Math.ceil(allTodos.length / currentLimit)
    return {
        total: allTodos.length,
        pages: totalPages,
        todos: paginatedTudos,
    }
}

export const todoRepository = {
    get,
}

// Model
interface Todo {
    id: string
    content: string
    date: string
    done: boolean
}

import { z } from 'zod';
import { todoRepository } from '../repository/todo';

import { Todo } from '@/ui/schema';

interface TodoControllerGetParams {
    page: number;
}
interface TodoControllerCreateParams {
    content: string;
    onError: (customMessage?: string) => void;
    onSuccess: (todo: Todo) => void;
}
const create = async ({ content, onError, onSuccess }: TodoControllerCreateParams) => {
    // Fail fast
    const parsedParams = z.string().nonempty().safeParse(content);
    if (!parsedParams.success) {
        onError('No content provided');
        return;
    }

    todoRepository
        .create(parsedParams.data)
        .then((todo) => {
            onSuccess(todo);
        })
        .catch(() => {
            onError('');
        });
};

async function get({ page }: TodoControllerGetParams) {
    return todoRepository.get({ page: page || 1, limit: 5 });
}

function filterByContent<Todo>(search: string, todos: Array<Todo & { content: string }>) {
    const homeTodos = todos.filter((todo) => {
        return todo.content?.toLowerCase().includes(search.toLowerCase());
    });
    return homeTodos;
}
export const todoController = {
    get,
    filterByContent,
    create,
};

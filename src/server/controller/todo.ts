import { read } from '@/db-crud-todo'
import { NextApiRequest, NextApiResponse } from 'next'
const get = (_: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ todos: read() })
    return
}

export const todoController = {
    get,
}

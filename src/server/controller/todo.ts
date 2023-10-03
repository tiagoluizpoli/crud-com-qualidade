import { NextApiRequest, NextApiResponse } from 'next'
import { todoRepository } from '../repository'

const create = async (req: NextApiRequest, res: NextApiResponse) => {
    const createdTodo = await todoRepository.createContent(req.body.content)
    res.status(201).json({
        todo: createdTodo,
    })
}

const get = (req: NextApiRequest, res: NextApiResponse) => {
    const query = req.query
    const page = Number(query.page)
    const limit = Number(query.limit)
    if (query.page && isNaN(page)) {
        res.status(400).json({
            error: {
                message: '`Page` must be a number',
            },
        })
        return
    }
    if (query.limit && isNaN(limit)) {
        res.status(400).json({
            error: {
                message: '`Limit` must be a number',
            },
        })
        return
    }
    const output = todoRepository.get({
        limit,
        page,
    })

    res.status(200).json(output)
}

export const todoController = {
    get,
    create,
}

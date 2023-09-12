import fs from 'fs'
import { v4 as uuid } from 'uuid'
const DB_FILE_PATH = './core/db'

interface Todo {
    id: string
    date: string
    checked: boolean
    content: string
}

function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        checked: false,
        date: new Date().toISOString(),
        content: content,
    }

    const todos: Array<Todo> = [...read(), todo]

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
                togs: [],
            },
            null,
            2
        )
    )

    return todo
}

function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, 'utf-8')
    const db = JSON.parse(dbString || '{}')
    if (db.todos) {
        return db.todos
    }
    return []
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, '')
}

CLEAR_DB()
create('Primeira TODO')
// const segundaTodo = create("Segunda TODO");

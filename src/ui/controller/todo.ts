async function get() {
    return fetch('/api/todos').then(async (succ) => {
        const response = await succ.json()
        return response
    })
}
export const todoController = {
    get,
}

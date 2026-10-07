import { utilService } from "./util.service.js"

export const todoService = {
    query,
    get,
    save,
    remove
}


const path = './data/todo.json'
const todos = utilService.readJsonFile(path)

function query(filterBy = {}) {
    let filteredTodos = [...todos]

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredTodos = filteredTodos.filter(todo => regExp.test(todo.txt))
    }

    if (filterBy.importance) {
        filteredTodos = filteredTodos.filter(todo => todo.importance >= filterBy.importance)
    }

    const importanceStats = getImportanceStats()
    return Promise.resolve({ todos: filteredTodos, importanceStats })
}

function get(todoId) {
    let todo = todos.find(todo => todo._id === todoId)
    todo = _setNextPrevTodoId(todo)

    return Promise.resolve(todo)
}

function save(todoToSave, loggedInUser) {
    if (todoToSave._id) {
        const todoIdx = todos.findIndex(todo => todo._id === todoToSave._id)
        const todo = todos[todoIdx]

        // if (!todo.creator || todo.creator._id !== loggedInUser._id) {
        //     return Promise.reject('Not a task you created')
        // }

        const updatedTodo = { ...todos[todoIdx], ...todoToSave }
        todos.splice(todoIdx, 1, updatedTodo)
    } else {
        todoToSave._id = utilService.makeId()
        todoToSave.createdAt = todoToSave.updatedAt = Date.now()

        // todoToSave.creator = {
        //     _id: loggedInUser._id,
        //     fullname: loggedInUser.fullname
        // }

        todos.push(todoToSave)

    }

    return _saveTodos()
        .then(() => todoToSave)
}

function remove(todoId, loggedInUser) {
    const todoIdx = todos.findIndex(todo => todo._id === todoId)
    const removedTodo = todos.at(todoIdx)
    todos.splice(todoIdx, 1)
    return _saveTodos()
        .then(() => removedTodo)
    // if ((loggedInUser.isAdmin) || (removedTodo.creator && removedTodo.creator._id === loggedInUser._id)) {
    //     todos.splice(todoIdx, 1)
    //     return _saveTodos()
    //         .then(() => removedTodo)
    // } else {
    //     return Promise.reject('Not a task you created')
    // }
}

function _saveTodos() {
    return utilService.writeJsonFile(path, todos)
}

function _setNextPrevTodoId(todo) {
    const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
    const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
    const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
    todo.nextTodoId = nextTodo._id
    todo.prevTodoId = prevTodo._id
    return todo

}

function getImportanceStats() {
    const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
    const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
    return data
}



function _getTodoCountByImportanceMap(todos) {
    const todoCountByImportanceMap = todos.reduce((map, todo) => {
        if (todo.importance < 3) map.low++
        else if (todo.importance < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
    return todoCountByImportanceMap
}

// function _sortBugs(bugs, sortBy, sortDir) {
//     let sortedBugs = [...bugs]

//     if (sortBy === 'title') {
//         sortedBugs.sort((bug1, bug2) => sortDir * (bug1.title.localeCompare(bug2.title)))
//     } else if (sortBy === 'severity') {
//         sortedBugs.sort((bug1, bug2) => sortDir * (bug1.severity - bug2.severity))
//     } else if (sortBy === 'createdAt') {
//         sortedBugs.sort((bug1, bug2) => sortDir * (bug1.createdAt - bug2.createdAt))
//     }

//     return sortedBugs
// }


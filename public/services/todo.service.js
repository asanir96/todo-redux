import { utilService } from './util.service.js'
import { showErrorMsg } from './event-bus.service.js'

const BASE_URL = '/api/todo/'

export const todoService = {
    query,
    getById,
    save,
    remove,
    getEmptyTodo,
    getDefaultFilter,
    getFilterFromSearchParams,
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => {
            return res.data.todos
        })
}

function getById(todoId) {
    return axios.get(BASE_URL + todoId)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('err', err.response.data)
            showErrorMsg(err.response.data)
        })
}

function remove(todoId) {
    return axios.delete(BASE_URL + todoId + '/')
        .then(res => res.data)
}

function save(todo) {
    if (todo._id) {
        return axios.put(BASE_URL + todo._id, todo)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, todo)
            .then(res => res.data)
    }
}

function getDefaultFilter() {
    return { txt: '', importance: 0}
}

function getEmptyTodo(txt = '', importance = 5) {
    return { txt, importance, isDone: false }
}

function getDefaultFilter() {
    return { txt: '', importance: 0 }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}



import { todoService } from '../../services/todo.service.js'
import { store } from '../store.js'
import { SET_TODOS, SET_ISLOADING, REMOVE_TODO, EDIT_TODO, ADD_TODO, SET_FILTERBY } from '../todo.reducer.js'

export function loadTodos(filterBy = {}) {
    store.dispatch({ type: SET_ISLOADING, isLoading: true })

    return todoService.query(filterBy)
        .then(todos => store.dispatch({ type: SET_TODOS, todos }))
        .finally(() => store.dispatch({ type: SET_ISLOADING, isLoading: false }))
}

export function removeTodo(todoId) {
    store.dispatch({ type: SET_ISLOADING, isLoading: true })

    return todoService.remove(todoId)
        .then(() => store.dispatch({ type: REMOVE_TODO, todoId }))
        .finally(() => store.dispatch({ type: SET_ISLOADING, isLoading: false }))

}

export function initFilterBy(searchParams) {
    const { filterBy } = store.getState().todoModule

    if (Object.keys(filterBy).length) return
    store.dispatch({ type: SET_FILTERBY, filterBy: todoService.getFilterFromSearchParams(searchParams) })
}


export function saveTodo(todoToSave) {
    return todoService.save(todoToSave)
        .then(todoToSave => {
            store.dispatch({ type: todoToSave._id ? EDIT_TODO : ADD_TODO, todo: todoToSave })
            return todoToSave
        })
}
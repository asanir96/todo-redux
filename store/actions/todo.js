import { todoService } from '../../services/todo.service.js'
import { store } from '../store.js'

export function loadTodos(filterBy = {}) {
    store.dispatch({ type: 'SET_ISLOADING', isLoading: true })

    return todoService.query(filterBy)
        .then(todos => store.dispatch({ type: 'SET_TODOS', todos }))
        .finally(() => store.dispatch({ type: 'SET_ISLOADING', isLoading: false }))
}

export function removeTodo(todoId) {
    store.dispatch({ type: 'SET_ISLOADING', isLoading: true })

    return todoService.remove(todoId)
        .then(() => store.dispatch({ type: 'REMOVE_TODO', todoId }))
        .finally(() => store.dispatch({ type: 'SET_ISLOADING', isLoading: false }))

}

export function saveTodo(todoToSave) {
    return todoService.save(todoToSave)
        .then(todoToSave => {
            store.dispatch({ type: todoToSave._id ? 'EDIT_TODO' : 'ADD_TODO', todo: todoToSave })
            return todoToSave
        })
}
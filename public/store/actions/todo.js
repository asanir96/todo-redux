import { todoService } from '../../services/todo.service.js'
import { userService } from '../../services/user.service.js'
import { store } from '../store.js'
import { SET_TODOS, SET_ISLOADING, REMOVE_TODO, EDIT_TODO, ADD_TODO, SET_FILTERBY } from '../todo.reducer.js'
import { userActivities } from './user.js'

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


export function saveTodo(todoToSave, isCompletedTask) {
    const loggedinUser = userService.getLoggedinUser()
    const isUpdate = !!todoToSave._id

    return todoService.save(todoToSave)
        .then(todoToSave => {
            if (!loggedinUser) {
                store.dispatch({ type: todoToSave._id ? EDIT_TODO : ADD_TODO, todo: todoToSave })
                return todoToSave
            }

            if (!isUpdate) {
                userActivities({ txt: `Added a task`, at: Date.now() })
            }
            else if (isCompletedTask) {
                userActivities({ txt: `Completed a task`, at: Date.now() })
            } else {
                userActivities({ txt: `Edited a todo`, at: Date.now() })
            }

            store.dispatch({ type: todoToSave._id ? EDIT_TODO : ADD_TODO, todo: todoToSave })
            return todoToSave
        })
}
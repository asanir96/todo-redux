const { createStore } = Redux
import { userService } from "../services/user.service.js"

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const EDIT_TODO = 'EDIT_TODO'

export const SET_FILTERBY = 'SET_FILTERBY'

export const SET_ISLOADING = 'SET_ISLOADING'

export const SET_USER = 'SET_USER'
export const SET_USER_SCORE = 'SET_USER_SCORE'

const initialState = {
    todos: [],
    filterBy: {},
    isLoading: true,
    loggedinUser: userService.getLoggedinUser(),

}


export function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case REMOVE_TODO:
            return {
                ...state, todos:
                    state.todos.filter(todo => todo._id !== cmd.todoId)
            }

        case EDIT_TODO:
            return { ...state, todos: state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo) }

        case SET_FILTERBY:
            return { ...state, filterBy: { ...state.filterBy, ...cmd.filterBy } }

        case SET_ISLOADING:
            return { ...state, isLoading: cmd.isLoading }

        case SET_USER:
            return { ...state, loggedinUser: cmd.loggedinUser }

        case SET_USER_SCORE:
            const loggedinUser = { ...state.loggedinUser, score: cmd.score }
            return { ...state, loggedinUser }

        default:
            return state
    }


}

export const store = createStore(appReducer)
window.gStore = store


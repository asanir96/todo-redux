const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const EDIT_TODO = 'EDIT_TODO'
export const ADD_TODO = 'ADD_TODO'

export const SET_FILTERBY = 'SET_FILTERBY'

export const SET_ISLOADING = 'SET_ISLOADING'


const initialState = {
    todos: [],
    filterBy: {},
    isLoading: false,
}


export function todoReducer(state = initialState, cmd = {}) {
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

        case ADD_TODO:
            return { ...state, todos: [...state.todos, cmd.todo] }

        case SET_FILTERBY:
            return { ...state, filterBy: { ...state.filterBy, ...cmd.filterBy } }

        case SET_ISLOADING:
            return { ...state, isLoading: cmd.isLoading }

        default:
            return state
    }


}


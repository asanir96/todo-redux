const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const EDIT_TODO = 'EDIT_TODO'
export const SET_FILTERBY = 'SET_FILTERBY'

const initialState = {
    todos: [],
    filterBy: {}
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
        default:
            return state
    }


}

export const store = createStore(appReducer)
window.gStore = store


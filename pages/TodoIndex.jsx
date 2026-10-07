import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo,initFilterBy } from "../store/actions/todo.js"

import { userActivities } from "../store/actions/user.js"

import { SET_FILTERBY } from "../store/todo.reducer.js"

const { useEffect } = React
const { useSelector, useDispatch } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {
    const user = useSelector(storeState => storeState.userModule.loggedinUser)
    const filterBy = useSelector(storeState => storeState.todoModule.filterBy)
    const todos = useSelector(storeState => storeState.todoModule.todos)
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)

    const dispatch = useDispatch()

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        initFilterBy(searchParams)

        // dispatch({ type: SET_FILTERBY, filterBy: todoService.getFilterFromSearchParams(searchParams) })
    }, [])

    useEffect(() => {
        if (!Object.keys(filterBy).length) return

        setSearchParams(filterBy)
        loadTodos(filterBy)
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load todos')
            })
    }, [filterBy])

    function onSetFilterBy(filterBy) {
        dispatch({ type: SET_FILTERBY, filterBy })
    }

    function onRemoveTodo(todoId) {
        removeTodo(todoId)
            .then(() => {
                userActivities({ txt: 'Deleted a task', at: Date.now() })
                showSuccessMsg(`Todo removed`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then((savedTodo) => {
                showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todoId)
            })
    }

    return (
        <section className="todo-index">
            {Object.entries(filterBy).length !== 0 && <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />}
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            {isLoading ? <div className="loader"></div> :
                <section className="content">
                    <TodoList
                        todos={todos}
                        onRemoveTodo={onRemoveTodo}
                        onToggleTodo={onToggleTodo}
                        color={user && user.preferences ? user.preferences.todoColor : null} />
                    <h2>Todos Table</h2>
                    <DataTable
                        todos={todos}
                        onRemoveTodo={onRemoveTodo}
                        color={user && user.preferences ? user.preferences.tableColor : null} />
                </section>}
        </section>
    )
}
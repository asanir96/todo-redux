import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveTodo } from "../store/actions/todo.js"
import { userBalance, userActivities } from "../store/actions/user.js"

const { useState, useEffect, useRef } = React
const { useNavigate, useParams } = ReactRouterDOM

export function TodoEdit() {

    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptyTodo())
    const isCompletedTask = useRef(false)
    // balanceChange.current = 0
    console.log('balanceChange.current', isCompletedTask.current)
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.todoId) loadTodo()
    }, [])

    function loadTodo() {
        todoService.get(params.todoId)
            .then(setTodoToEdit)
            .catch(err => console.log('err:', err))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                console.log('value', value)
                console.log('value===true', value === true)
                if (value === true) isCompletedTask.current = true

                console.log('balanceChange.current', isCompletedTask.current)

                break

            default:
                break
        }

        setTodoToEdit(prevTodoToEdit => ({ ...prevTodoToEdit, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        saveTodo(todoToEdit)
            .then((savedTodo) => {
                navigate('/todo')
                showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
                if (!params.todoId) {
                    userActivities({ txt: `Added a task`, at: Date.now() })
                }
                else if (isCompletedTask.current) {
                    userActivities({ txt: `Completed a task`, at: Date.now() })
                } else {
                    userActivities({ txt: `Edited a todo`, at: Date.now() })
                }
            })
            .catch(err => {
                showErrorMsg('Cannot save todo')
                console.log('err:', err)
            })
    }

    const { txt, importance, isDone } = todoToEdit

    return (
        <section className="todo-edit">
            <form onSubmit={onSaveTodo} >
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="importance">Importance:</label>
                <input onChange={handleChange} value={importance} type="number" name="importance" id="importance" />

                <label htmlFor="isDone">isDone:</label>
                <input onChange={handleChange} value={isDone} type="checkbox" name="isDone" id="isDone" checked={isDone} />


                <button>Save</button>
            </form>
        </section>
    )
}
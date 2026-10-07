const { useState, useRef } = React

import { utilService } from "../services/util.service.js"
import {useEffectUpdate} from '../custom-hooks/useEffectUpdate.js'


export function TodoFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    const debouncedApplyFilter =
        useRef(utilService.debounce(filterBy => {
            onSetFilterBy(filterBy)
        }, 500)).current

    useEffectUpdate(() => {
        // Notify parent
        debouncedApplyFilter(filterByToEdit)
    }, [filterByToEdit])

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
                break

            default: break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // Optional support for LAZY Filtering with a button
    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, importance } = filterByToEdit
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={onSubmitFilter}>
                <input value={txt} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input value={importance} onChange={handleChange}
                    type="number" placeholder="By Importance" id="importance" name="importance"
                />

                <button hidden>Set Filter</button>
            </form>
        </section>
    )
}
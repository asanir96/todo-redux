const { useState, useEffect } = React


export function UserPreferences({ user, onUpdateUser }) {
    const [userToEdit, setUserToEdit] = useState(user)


    function handleChange({ target }) {
        const { name, value, type } = target
        if (type == 'color') {
            setUserToEdit(prev => ({ ...prev, preferences: { ...prev.preferences, [name]: value } }))
        }
        setUserToEdit(prev => ({ ...prev, [name]: value }))
    }

    return <form className="preferences-form" onSubmit={ev => onUpdateUser(userToEdit, ev)}>
        <div className="preference-field">
            <label htmlFor="">Name:</label>
            <input type="text"
                onChange={handleChange}
                value={userToEdit.fullname}
                name="fullname" />
        </div>

        <div className="preference-field">

            <label htmlFor="">Table color:</label>
            <input type="color"
                onChange={handleChange}
                value={userToEdit.preferences ? userToEdit.preferences.tableColor : 'rgb(0, 152, 121)'}
                name="tableColor" />
        </div>

        <div className="preference-field">

            <label htmlFor="">Todo color:</label>
            <input type="color"
                onChange={handleChange}
                value={userToEdit.preferences ? userToEdit.preferences.todoColor : 'rgb(153, 166, 149)'}
                name="todoColor" />
        </div>

        <button>Save</button>

    </form>
}
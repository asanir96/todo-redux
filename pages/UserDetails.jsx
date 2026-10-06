import { userService } from "../services/user.service.js"
import { ActivitiesTable } from "../cmps/activities-table/ActivitiesTable.jsx"
import { updateUser } from "../store/actions/user.js"
import { showSuccessMsg } from "../services/event-bus.service.js"
import { UserPreferences } from "../cmps/UserPreferences.jsx"

const { useState, useEffect } = React
const { useSelector } = ReactRedux
const { useParams, useNavigate } = ReactRouterDOM

export function UserDetails() {
    const params = useParams()
    const navigate = useNavigate()

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const [user, setUser] = useState(null)
    const [userActivities, setUserActivities] = useState(null)

    useEffect(() => {
        userService.getById(params.userId)
            .then(user => {
                setUser(user)
            })

    }, [])

    useEffect(() => {
        userService.getUserActivies(params.userId)
            .then(setUserActivities)

    }, [])


    function onUpdateUser(userToEdit, ev) {
        ev.preventDefault()
        return updateUser(userToEdit)
            .then(() => {
                showSuccessMsg('User prefs. updated')
                navigate('/todo')
            })
    }

    if (!user) return <div>Loading...</div>

    return (
        <section className="user-details">
            <h2>{user.fullname}</h2>
            
            {user._id === loggedinUser._id &&
                <UserPreferences user={loggedinUser} onUpdateUser={onUpdateUser} />}

            <ActivitiesTable
                activities={userActivities}
                bgColor={user.preferences ? user.preferences.tableColor : null} />

        </section>
    )
}
import { showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"
import { ActivitiesTable } from "../cmps/activities-table/ActivitiesTable.jsx"

const { useState, useEffect } = React
const { useSelector } = ReactRedux
const { useParams, useNavigate, Link } = ReactRouterDOM

export function UserDetails() {
    // const [user, setUser] = useState(null)
    const user = useSelector(storeState => storeState.loggedinUser)
    const [userActivities, setUserActivities] = useState(null)

    console.log('userActivities', userActivities)
    useEffect(() => {
        userService.getUserActivies(user._id)
            .then(setUserActivities)

    }, [])

    return (
        <section className="user-details">
            <h2>{user.fullname}</h2>
            {userActivities ?
                <section className="activities">
                    <h3>User Activities</h3>
                    <ActivitiesTable activities={userActivities} />
                </section> :
                <div>Loading...</div>
            }
        </section>
    )
}
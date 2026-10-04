const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { userLogout } from '../store/actions/user.js'


export function AppHeader() {
    const navigate = useNavigate()
    const user = useSelector(storedState => storedState.loggedinUser)

    function onLogout() {
        userLogout()
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
            .then(() => {
                navigate('/')
            })
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    < section  className="logged-in-user" >
                        <Link to={`/user/${user._id}`}>
                            <p >Hello {user.fullname} {user.balance && <span>{user.balance} pts</span>}</p>

                        </Link>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}

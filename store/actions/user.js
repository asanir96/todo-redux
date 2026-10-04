import { userService } from '../../services/user.service.js'
import { CLEAR_CART, SET_USER, SET_USER_BALANCE, store } from '../store.js'

export function userLogin(credentials) {
    return userService.login(credentials)
        .then(loggedinUser => {
            console.log('loggedInUser', loggedinUser)
            store.dispatch({ type: SET_USER, loggedinUser })
            return loggedinUser
        })
}

export function userSignup(credentials) {
    return userService.signup(credentials)
        .then(loggedinUser => {
            console.log('loggedInUser', loggedinUser)

            store.dispatch({ type: SET_USER, loggedinUser })
            return loggedinUser
        })
}

export function userLogout() {
    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_USER, loggedinUser: null })
        })
}

export function userBalance(amount) {
    return userService.updateBalance(+amount)
        .then(updatedBalance => {
            store.dispatch({ type: SET_USER_BALANCE, userBalance: updatedBalance })
        })
}
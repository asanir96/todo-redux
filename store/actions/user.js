import { userService } from '../../services/user.service.js'
import { CLEAR_CART, SET_USER, SET_USER_SCORE, store } from '../store.js'

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

export function checkout(amount) {
    return userService.updateScore(-amount)
        .then(updatedScore => {
            store.dispatch({ type: SET_USER_SCORE, score: updatedScore })
            store.dispatch({ type: CLEAR_CART })
        })
}
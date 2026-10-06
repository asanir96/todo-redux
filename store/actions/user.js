import { userService } from '../../services/user.service.js'
import { CLEAR_CART, SET_USER, SET_USER_BALANCE,SET_USER_ACTIVITIES, store } from '../store.js'

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

export function userActivities(activity) {
    return userService.updateUserActivities(activity)
        .then(updatedActivities => {
            store.dispatch({ type: SET_USER_ACTIVITIES, userActivities: updatedActivities.activities })
            store.dispatch({ type: SET_USER_BALANCE, userBalance: updatedActivities.balance })
        })
}
export function updateUser(user) {
    return userService.update(user)
        .then(updatedUser => {
                store.dispatch({ type: SET_USER, loggedinUser: updatedUser })
                return updateUser
        })
}
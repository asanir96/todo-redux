const { createStore } = Redux
import { userService } from "../services/user.service.js"

export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'
export const SET_USER_ACTIVITIES = 'SET_USER_ACTIVITIES'

const initialState = {
    loggedinUser: userService.getLoggedinUser(),
}


export function userReducer(state = initialState, cmd = {}) {
    let loggedinUser
    switch (cmd.type) {
        case SET_USER:
            return { ...state, loggedinUser: cmd.loggedinUser }

        case SET_USER_BALANCE:
            loggedinUser = { ...state.loggedinUser, balance: cmd.userBalance }
            return { ...state, loggedinUser }

        case SET_USER_ACTIVITIES:
            loggedinUser = { ...state.loggedinUser, activities: cmd.userActivities }
            return { ...state, loggedinUser }

        default:
            return state
    }


}


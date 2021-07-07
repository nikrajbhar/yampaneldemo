
import { SAVE_LOGIN, LOGIN_ERROR, CLEAR_LOGIN } from "../constants/actionTypes";

const initialState = {
    userdata: null,
    token:null,
    islogged: false,
    errorLogin: undefined,
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case SAVE_LOGIN:
            return {
                ...state,
                userdata: action.data,
                token: action.token,
                islogged: true,
                errorLogin: undefined
            }
        case LOGIN_ERROR:
            return {
                ...state,
                userdata: null,
                token: null,
                islogged: false,
                errorLogin: action.data,
            }
        case CLEAR_LOGIN:
            return {
                ...state,
                userdata: null,
                token: null,
                islogged: false,
                errorLogin: undefined,
            }
        default:
            return state
    }
}


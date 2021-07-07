import { SAVE_LOGIN, LOGIN_ERROR, CLEAR_LOGIN } from "../constants/actionTypes";
import { setCookie, destroyCookie } from "nookies";

export const clearLoginData = () => {
    return (dispatch) => {
        destroyCookie(null, 'token');
        dispatch({ type: CLEAR_LOGIN });
    }
}

export const login_details = ({ email, password, userType }) => {
    return (dispatch) => {
        fetch(`/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                userType
            })
        })
            .then(res => res.json())
            .then(res2 => {
                console.log("fetch res", res2);
                if (res2.success) {
                    dispatch({ type: SAVE_LOGIN, data: res2.user, token: res2.token });
                    setCookie(null, 'token', res2.token, {
                        maxAge: 2 * 60 * 60
                    });
                } else {
                    dispatch({ type: LOGIN_ERROR, data: res2.message });
                }
            })
    }
}

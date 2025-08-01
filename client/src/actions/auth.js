import axios from "axios";
import { setAlert } from "./alert";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get("/api/auth");

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

// Auth Register User
export const authRegister =
    ({ name, email, password }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify({ name, email, password });

        try {
            const res = await axios.post("/api/users", body, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
            });
            dispatch(loadUser());
        } catch (error) {
            const errors = error.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, "danger"));
                });
            }
            dispatch({
                type: REGISTER_FAIL,
            });
        }
    };

// Auth Login User
export const authLogin =
    ({ email, password }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify({ email, password });

        try {
            const res = await axios.post("/api/auth", body, config);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
            dispatch(loadUser());
        } catch (error) {
            const errors = error.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, "danger"));
                });
            }
            dispatch({
                type: LOGIN_FAIL,
            });
        }
    };

// Logout

export const logout = () => (dispatch) => {
    dispatch({
        type: LOGOUT,
    });
};

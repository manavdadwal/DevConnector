import axios from "axios";
import { setAlert } from "./alert";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
} from "../actions/types";

import setAuthToken from "../../utils/setAuthToken";

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
    async (dispacth) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify({ name, email, password });

        try {
            const res = await axios.post("/api/users", body, config);

            dispacth({
                type: REGISTER_SUCCESS,
                payload: res.data,
            });
            dispacth(loadUser());
        } catch (error) {
            const errors = error.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispacth(setAlert(error.msg, "danger"));
                });
            }
            dispacth({
                type: REGISTER_FAIL,
            });
        }
    };

// Auth Login User
export const authLogin =
    ({ email, password }) =>
    async (dispacth) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify({ email, password });

        try {
            const res = await axios.post("/api/auth", body, config);

            dispacth({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
            dispacth(loadUser());
        } catch (error) {
            const errors = error.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispacth(setAlert(error.msg, "danger"));
                });
            }
            dispacth({
                type: LOGIN_FAIL,
            });
        }
    };

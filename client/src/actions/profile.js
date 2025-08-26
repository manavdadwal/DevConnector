import axios from "axios";
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from "actions/types";
import { setAlert } from "./alert";

// Get Current Profile
export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/profile/me");
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

// Create or Update Profile
export const createProfile =
    (formData, navigate, edit = false) =>
    async (dispatch) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const res = await axios.post("api/profile", formData, config);

            dispatch({
                type: GET_PROFILE,
                payload: res.data,
            });

            dispatch(
                setAlert(
                    edit ? "Profile Updated" : "Profile Created",
                    "success"
                )
            );

            if (!edit) {
                navigate("/dashboard");
            }
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, "danger"));
                });
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        }
    };

// Add Experience

export const addExperience =
    (formData, navigate, history) => async (dispatch) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const res = await axios.put(
                "api/profile/experience",
                formData,
                config
            );

            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data,
            });

            dispatch(setAlert("Experience Added", "success"));

            navigate("/dashboard");
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, "danger"));
                });
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        }
    };

//Add Education

export const addEducation =
    (formData, navigate, history) => async (dispatch) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const res = await axios.put(
                "api/profile/education",
                formData,
                config
            );

            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data,
            });

            dispatch(setAlert("Education Added", "success"));

            navigate("/dashboard");
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, "danger"));
                });
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        }
    };

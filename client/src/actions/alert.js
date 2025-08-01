/**
 * Actions are objects where the 'type' property is mandatory for the reducer to process the action.
 */
import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 as uuidv4 } from "uuid";

export const setAlert =
    (msg, alertType, timeOut = 5000) =>
    (dispatch) => {
        const id = uuidv4();
        dispatch({
            type: SET_ALERT,
            payload: { msg, alertType, id },
        });

        setTimeout(
            () => dispatch({ type: REMOVE_ALERT, payload: id }),
            timeOut
        );
    };

import { SET_ALERT, REMOVE_ALERT } from "../components/actions/types";
const initialState = []; // Initial state ensures the store is populated with default data at startup.

export default function alertReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter((alert) => alert.id !== payload);
        default:
            return state;
    }
}

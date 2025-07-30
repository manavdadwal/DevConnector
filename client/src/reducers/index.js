import { combineReducers } from "redux"; // Reducers are used to modify the state in the Redux store based on the action received.
import alert from "./alert";
import auth from "./auth";

export default combineReducers({
    alert,
    auth,
});

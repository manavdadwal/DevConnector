import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: composeWithDevTools(), // process.env.NODE_ENV !== "production",
});

export default store;

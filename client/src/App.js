import React from "react";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import Navbar from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Alert from "./components/layout/Alert";
// REDUX
import { Provider } from "react-redux";
import store from "./store";
import setAuthToken from "utils/setAuthToken";
import { loadUser } from "components/actions/auth";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Fragment>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Landing />} />
                    </Routes>
                    <section className="container">
                        <Alert />
                        <Routes>
                            <Route
                                exact
                                path="/register"
                                element={<Register />}
                            />
                            <Route exact path="/login" element={<Login />} />
                        </Routes>
                    </section>
                </Fragment>
            </BrowserRouter>
        </Provider>
    );
};

export default App;

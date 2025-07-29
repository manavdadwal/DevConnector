import React from "react";
import { Fragment } from "react/jsx-runtime";
import Navbar from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// REDUX
import { Provider } from "react-redux";
import store from "./store";

const App = () => (
    <Provider store={store}>
        <BrowserRouter>
            <Fragment>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Landing />} />
                </Routes>
                <section className="container">
                    <Routes>
                        <Route exact path="/register" element={<Register />} />
                        <Route exact path="/login" element={<Login />} />
                    </Routes>
                </section>
            </Fragment>
        </BrowserRouter>
    </Provider>
);

export default App;

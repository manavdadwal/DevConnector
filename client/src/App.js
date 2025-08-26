import React from "react";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "components/routing/PrivateRoute";
import CreateProfile from "components/profile-forms/CreateProfile";
import EditProfile from "components/profile-forms/EditProfile";
import AddExperience from "components/profile-forms/AddExperience";
import AddEducation from "components/profile-forms/AddEducation";
// REDUX
import { Provider } from "react-redux";
import store from "./store";
import setAuthToken from "utils/setAuthToken";
import { loadUser } from "actions/auth";

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
                <>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/create-profile"
                            element={
                                <PrivateRoute>
                                    <CreateProfile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/edit-profile"
                            element={
                                <PrivateRoute>
                                    <EditProfile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/add-experience"
                            element={
                                <PrivateRoute>
                                    <AddExperience />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/add-education"
                            element={
                                <PrivateRoute>
                                    <AddEducation />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </>
            </BrowserRouter>
        </Provider>
    );
};

export default App;

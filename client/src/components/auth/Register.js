import React, { Fragment, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { authRegister } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, authRegister, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
    });

    const { name, email, password, password2 } = formData;

    const onChange = (e) =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            setAlert("Passwords do not match.", "danger");
        } else {
            // console.log("SUCCESS");
            // console.log(formData);
            // const newUser = {
            //     name,
            //     email,
            //     password,
            // };

            // try {
            //     const config = {
            //         headers: {
            //             "Content-Type": "application/json",
            //             crossOriginIsolated: false,
            //         },
            //     };
            //     const body = JSON.stringify(newUser);
            //     const res = await axios.post("/api/users", body, config);
            //     console.log(res.data);
            // } catch (error) {
            //     console.error(error.res);
            // }

            authRegister({ name, email, password });
        }
    };

    // Navigate if login
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead">
                    <i className="faS fa-user"></i> Create Your Account
                </p>
                <form className="form" onSubmit={(e) => onSubmit(e)}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            // required
                            value={name}
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            // required
                            onChange={(e) => onChange(e)}
                        />
                        <small className="form-text">
                            This site uses Gravatar so if you want a profile
                            image, use a Gravatar email
                        </small>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            // minLength="6"
                            value={password}
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            // minLength="6"
                            value={password2}
                            onChange={(e) => onChange(e)}
                        />
                    </div>{" "}
                    <input
                        type="submit"
                        className="btn btn-primary"
                        value="Register"
                        onChange={(e) => onChange(e)}
                    />
                </form>
                <p className="my-1">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </section>
        </Fragment>
    );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    authRegister: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, authRegister })(Register); // The connect function connects a component to the Redux store.

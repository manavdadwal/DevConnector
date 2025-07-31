import React, { Fragment, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { authLogin } from "components/actions/auth";
import PropTypes from "prop-types";

const Login = ({ authLogin, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    const onSubmit = async (e) => {
        e.preventDefault();
        authLogin({ email, password });
    };

    // Navigate if login
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead">
                    <i className="faS fa-user"></i> Sing In Your Account
                </p>
                <form className="form" onSubmit={(e) => onSubmit(e)}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            required
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            minLength="6"
                            value={password}
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                    <input
                        type="submit"
                        className="btn btn-primary"
                        value="Login"
                        onChange={(e) => onChange(e)}
                    />
                </form>
                <p className="my-1">
                    Do not have an account? <Link to="/register">Sign Up</Link>
                </p>
            </section>
        </Fragment>
    );
};

Login.propTypes = {
    authLogin: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { authLogin })(Login);

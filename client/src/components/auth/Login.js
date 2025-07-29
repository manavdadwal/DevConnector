import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
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
    };

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
                        />{" "}
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
}

import React from "react";

const Navbar = () => {
    return (
        <nav className="navbar bg-dark">
            <h1>
                <a href="index.html">
                    <i className="fas fa-code"></i>DevConnector
                </a>
            </h1>
            <ul>
                <li href="profiles.html">Developers</li>
                <li href="register.html">Register</li>
                <li href="login.html">Login</li>
            </ul>
        </nav>
    );
};

export default Navbar;

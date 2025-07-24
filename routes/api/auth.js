const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const userModel = require("../../models/users-model");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

/**
 * @route         - GET API/auth
 * @description   - Test route
 * @access        - Public
 */

router.get("/", auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

/**
 * @route         - POST API/users
 * @description   - Register user
 * @access        - Public
 */

router.post(
    "/",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        // If user doesn't exists

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // If user Exists
            let user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: "Invalid Credentials." }],
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: [{ msg: "Invalid Credentials." }],
                });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get("jwtSecretKey"),
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    console.log("token", token);
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;

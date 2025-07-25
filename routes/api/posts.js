const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const profileModel = require("../../models/profile-model");
const userModel = require("../../models/users-model");
const { check, validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const usersModel = require("../../models/users-model");
const request = require("request");
const postModel = require("../../models/post-model");

/**
 * @route         - Post API/posts
 * @description   - Create a Post
 * @access        - Public
 */

router.post(
    "/",
    [auth, [check("text", "Text is required").not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await userModel
                .findById(req.user.id)
                .select("-password");

            const newPost = new postModel({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });

            const post = await newPost.save();

            res.json(post);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

/**
 * @route         - GET API/posts
 * @description   - GET all Posts
 * @access        - Private
 */

router.get("/", auth, async (req, res) => {
    try {
        const post = await postModel.find().sort({ date: -1 });
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

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

/**
 * @route         - GET API/posts/:id
 * @description   - GET Posts by ID
 * @access        - Private
 */

router.get("/:id", auth, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }
        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found." });
        }
        res.status(500).send("Server Error");
    }
});

/**
 * @route         - DELETE API/posts/:id
 * @description   - DELETE Posts by ID
 * @access        - Private
 */

router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized." });
        }
        await post.deleteOne();
        res.json({ msg: "Post removed." });
    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found." });
        }
        res.status(500).send("Server Error");
    }
});

/**
 * @route         - PUT api/profile/like/:id
 * @description   - Like a post
 * @access        - Public
 */

router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: "Post already liked." });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

/**
 * @route         - PUT api/profile/unlike/:id
 * @description   - Unlike a post
 * @access        - Public
 */

router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res
                .status(400)
                .json({ msg: "Post has not yet been liked." });
        }

        const removeLikeIndex = post.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.id);

        post.likes.splice(removeLikeIndex, 1);
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

/**
 * @route         - Post API/posts/comment/:id
 * @description   - Comment on Post
 * @access        - Public
 */

router.post(
    "/comment/:id",
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

            const post = await postModel.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

/**
 * @route         - DELETE API/comment/:post_id/:comment_id
 * @description   - DELETE Comments by ID
 * @access        - Private
 */

router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.post_id);

        const comments = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        );

        if (!comments) {
            return res.status(404).json({ msg: "Comment not found." });
        }
        if (comments.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized." });
        }

        const removeCommentIndex = post.comments
            .map((comment) => comment.user.toString())
            .indexOf(req.user.id);

        post.comments.splice(removeCommentIndex, 1);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

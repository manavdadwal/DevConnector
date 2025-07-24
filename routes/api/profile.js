const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const profileModel = require("../../models/profile-model");
const userModel = require("../../models/users-model");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const usersModel = require("../../models/users-model");

/**
 * @route         - GET api/profile/me
 * @description   - Get current users profile
 * @access        - Public
 */

router.get("/me", auth, async (req, res) => {
    try {
        const profile = await profileModel
            .findOne({ user: req.user.id })
            .populate("user", ["name", "avatar"]);

        if (!profile) {
            return res.status(400).json({ msg: `Profile doesn't Exists` });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

/**
 * @route         - Post api/profile
 * @description   - Create or Update user profile
 * @access        - Public
 */

router.post(
    "/",
    [
        auth,
        check("status", "Status is required").not().isEmpty(),
        check("skills", "Skills is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills
                .split(",")
                .map((skill) => skill.trim());
            console.log(profileFields.skills);
        }

        // Build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await profileModel.findOne({ user: req.user.id });

            if (profile) {
                profile = await profileModel.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }

            // Create
            profile = new profileModel(profileFields);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
);

/**
 * @route         - Get api/profile
 * @description   - Get all profiles
 * @access        - Public
 */

router.get("/", async (req, res) => {
    try {
        const profiles = await profileModel
            .find()
            .populate("user", ["name", "avatar"]);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

/**
 * @route         - Get api/profile/user/:user_id
 * @description   - Get profile UserId
 * @access        - Public
 */

router.get("/user/:user_id", async (req, res) => {
    try {
        const profiles = await profileModel
            .findOne({ user: req.params.user_id })
            .populate("user", ["name", "avatar"]);

        if (!profiles)
            return res
                .status(400)
                .json({ msg: "Profile doesn't exists for this user" });
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res
                .status(400)
                .json({ msg: "Profile doesn't exists for this user" });
        }
        res.status(500).send("Server Error");
    }
});

/**
 * @route         - Delete api/profile/user/:user_id
 * @description   - Delete profile & user
 * @access        - Public
 */

router.delete("/", auth, async (req, res) => {
    try {
        // @todo - remove users & posts

        // Remove profiles
        await profileModel.findOneAndDelete({
            user: req.user.id,
        });

        // Remove user
        await usersModel.findOneAndDelete({
            _id: req.user.id,
        });

        res.json({ msg: "User deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

/**
 * @route         - PUT api/profile/experience
 * @description   - Add profile experience
 * @access        - Public
 */

router.put(
    "/experience",
    [
        auth,
        [
            check("title", "Title is required.").not().isEmpty(),
            check("company", "Company is required.").not().isEmpty(),
            check("from", "From date is required.").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, company, from, to, current, description } = req.body;

        const newExp = {
            title,
            company,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await profileModel.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

/**
 * @route         - Delete api/profile/experience/:exp_id
 * @description   - Delete experience from profile
 * @access        - Public
 */

router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        // Remove experiences
        const profile = await profileModel.findOne({
            user: req.user.id,
        });

        const removeExperienceIndex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeExperienceIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

/**
 * @route         - PUT api/profile/education
 * @description   - Add profile education
 * @access        - Public
 */

router.put(
    "/education",
    [
        auth,
        [
            check("school", "School is required.").not().isEmpty(),
            check("degree", "Degree is required.").not().isEmpty(),
            check("fieldofstudy", "Field of study is required.")
                .not()
                .isEmpty(),
            check("from", "From date is required.").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { school, degree, fieldofstudy, from, to, current, description } =
            req.body;

        const newExp = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await profileModel.findOne({ user: req.user.id });
            profile.education.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

/**
 * @route         - Delete api/profile/education/:edu_id
 * @description   - Delete education from profile
 * @access        - Public
 */

router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        // Remove experiences
        const profile = await profileModel.findOne({
            user: req.user.id,
        });

        const removeEducationIndex = profile.education
            .map((item) => item.id)
            .indexOf(req.params.edu_id);

        profile.education.splice(removeEducationIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

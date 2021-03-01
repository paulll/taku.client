const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const auth = require("../middlewares/auth.js");       // Import auth system

const router = express.Router();

// Routes
router.get("/:username", async (req, res) => {

    // Get user
    const user = (await db.users.find(
        { username: req.params.username },
        { collation: { locale: "en", strength: 2 } }
    ))[0];

    // // Add their statuses
    // if (user) {
    //     if (onlineUsers.some(onlineUser => onlineUser.uuid == user.uuid)) {
    //         user.profile.status.isOnline = true
    //     }
    //     else {
    //         user.profile.status.isOnline = false
    //     }
    // }

    res.status(200);
    res.json(user);
});

// Protected Routes
router.get("/", auth, async (req, res) => {
    res.status(200);
    res.json(req.user);
});

router.post("/computer", auth, async (req, res) => {
    await db.users.update(
        { username: req.user.username },
        { $set: { 'profile.computer': req.body.computer } }
    );

    res.status(200);
    res.json({ message: "done" });
});

router.post("/anime", auth, async (req, res) => {
    const anime_id = req.body.anime;

    if (req.body.action == true) {
        await db.users.update(
            { uuid: req.user.uuid },
            { $addToSet: { "profile.anime_list": anime_id } }
        );
    }
    else if (req.body.action == false) {
        await db.users.update(
            { uuid: req.user.uuid },
            { $pull: { "profile.anime_list": anime_id } }
        );
    }

    if (req.body.isSignup == true) {
        await db.users.update(
            { uuid: req.user.uuid },
            { $set: { "profile.anime_list": anime_id } }
        );
    }

    res.status(200);
    res.json({ message: `Anime ${anime_id} added to your favorites!` });
});

router.post("/socials", async (req, res) => {
    // Parse body
    const body = req.body;

    await db.users.update(
        { username: req.user.username },
        { $set: { "profile.socials": body.socials } }
    );

    res.status(200);
    res.json({ message: "done" });
});

router.get("/blockedUsers", auth, async (req, res) => {
    res.status(200).json(req.user.settings.privacy.blocked_users);
});

module.exports = router
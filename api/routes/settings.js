const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const fs = require("fs");
const auth = require("../middlewares/auth.js");
const multer = require("multer");
const upload = multer({ dest: "./db/uploads/" });

const router = express.Router();

router.use(auth);

// Setting Routes
router.post("/", async (req, res) => {
    await db.users.update(
        { uuid: req.user.uuid },
        { $set: { profile: req.body.profile, settings: req.body.settings, friend_list: req.body.friend_list } }
    );
    res.status(200).json({ "message": "Changes saved successfully" });
});
router.post("/upload", upload.any(), async (req, res) => {
    let file = req.files[0];
    file.originalname = `${new Date().getTime()}-${file.originalname.replace(/\s/g, "_")}`;

    let link = `https://taku.moe:2087/${file.fieldname}/${req.user.uuid}`;

    // Add the original image in the cache folder if its not a png/jpeg
    fs.copyFileSync(`./db/uploads/${file.filename}`, `./db/${file.fieldname}/cache/${req.user.uuid}`);
    fs.copyFileSync(`./db/uploads/${file.filename}`, `./db/${file.fieldname}/${req.user.uuid}`);

    res.status(201).json({
        status: 200,
        message: "File uploaded successfully",
        link,
    });
});

module.exports = router
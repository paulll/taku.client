const express = require('express');
const db = require("../handlers/database.js");       // Import database handler

const router = express.Router();

// Search Endpoints
router.post("/", async (req, res) => {

    let searchString = req.body.searchString.toLowerCase();

    const keywords = String.raw`.*${searchString}.*`;
    const animelist = await db.anime.find(
        { "title.english": new RegExp(keywords, "i") }
    );

    const userlist = await db.users.find(
        { username: { $regex: new RegExp(keywords, "gi") } },
        { collation: { locale: "en", strength: 2 } }
    );

    let searchResults = {
        users: userlist,
        anime: animelist,
    }

    res.status(200);
    res.json(searchResults);

});
router.get("/anime/:name", async (req, res) => {
    const keywords = String.raw`.*${req.params.name}.*`;
    const animelist = await db.anime.find({ "title.english": new RegExp(keywords, "i") });
    res.status(200);
    res.json({ animelist: animelist });
});

module.exports = router
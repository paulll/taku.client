const express = require('express');
const db = require("../handlers/database.js");

const router = express.Router();

router.get("/", async (req, res) => {
    const animeList = await db.anime.find();
    res.status(200).json({ animeList });
});

router.get("/random/:amount?", async (req, res) => {
    const amount = parseInt(req.params.amount) || 20;
    const animeList = await db.anime.aggregate([{'$sample': {'size': amount }}]);
    res.status(200).json({ animeList });
});

router.get("/id/:id", async (req, res) => {
    const result = await db.anime.find({ id: parseInt(req.params.id) });
    res.status(200).json({ anime: result });
});

module.exports = router
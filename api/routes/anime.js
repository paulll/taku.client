const express = require('express');
const db = require("../handlers/database.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const animelist = await db.anime.find();
  res.status(200).json({ animelist: animelist });
});

router.get("/id/:id", async (req, res) => {
    const result = await db.anime.find({ id: parseInt(req.params.id) });
    res.status(200).json({ anime: result });
});

module.exports = router
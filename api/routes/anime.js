const express = require('express');
const db = require("../handlers/database.js");       // Import database handler

const router = express.Router();

router.get("/", async (req, res) => {
  const animelist = await db.anime.find();
  res.status(200);
  res.json({ animelist: animelist });
});

router.get("/id/:id", async (req, res) => {
    const result = await db.anime.find({ id: parseInt(req.params.id) });
    res.status(200);
    res.json({ anime: result });
});

module.exports = router
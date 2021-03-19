const express = require('express');
const db = require("../handlers/database.js");
const multer = require("multer");
const upload = multer({ dest: "./db/uploads/" });
const auth = require("../middlewares/auth.js");
const taku = require("../handlers/classes.js");
const Jimp = require("jimp");
const fs = require("fs");

const router = express.Router();

router.get("/:tag", async (req, res) => {
    const wallpapers = (await db.wallpapers.aggregate([
        {'$match': {'tags': req.params.tag}},
        {'$sort' : {'likes': -1 }}
    ]));

    res.status(200).json({ wallpapers });
});

router.get("/all", async (req, res) => {
    const tagList = (await db.wallpapers.aggregate([
        {'addFields': {'likes': {'$size': '$likes'}} 
        {'$project': {'tags': 1, 'likes': 1} 
        {'$unwind': {'path': '$tags'} 
        {'$group': {'_id': 'tags', 'tags': 
        {'$push': {'tag': '$tags', 'likes': {'$sum': '$likes'}}}}
    ]))
});

module.exports = router 
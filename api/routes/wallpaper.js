const express = require('express');
const db = require("../handlers/database.js");
const multer = require("multer");
const upload = multer({ dest: "./db/uploads/" });
const auth = require("../middlewares/auth.js");
const taku = require("../handlers/classes.js");
const Jimp = require("jimp");
const fs = require("fs");

const router = express.Router();

function errorHandler(error, res){
    error = error.toString();
    res.status(500).json({message: 'error updating wallpaper in database', error});
}

router.get("/:uuid", async (req, res) => res.status(200).json((await db.wallpapers.find({uuid: req.params.uuid}))[0]));
router.post("/", auth, upload.any(), async (req, res) => {
    if (!req.body.metadata) return res.status(400).json({message: 'missing metadata'});
    const metadata = JSON.parse(req.body.metadata);
    metadata.submitter_uuid = req.user.uuid;

    if (req.files) var image = req.files[0];
    else return res.status(400).json({message: 'missing image'});

    const jimpImage = await Jimp.read(`db/uploads/${image.filename}`);
    const fileName = `${new Date().getTime()}-${image.originalname}`;
    jimpImage.write(`db/wallpapers/${fileName}`);
    jimpImage.fileName = fileName;
    fs.unlink(`db/uploads/${image.filename}`, () => {}); // Delete original file from uploads folder since we moved it to its correct folder

    try {
        const wallpaper = new taku.Wallpaper(image, jimpImage, metadata);
        await db.wallpapers.insert(wallpaper);
        res.status(201).json({message: 'wallpaper successfully submitted', wallpaper});
    } catch (error) {
        if(error) errorHandler(error, res);
    }
}); 

router.post("/like/:wallpaper_uuid", auth, async (req, res) => {
    try {
        const wallpaper = await db.wallpapers.update({uuid: req.params.wallpaper_uuid}, {$addToSet: { 'likes': req.user.uuid }});
        res.status(200).json({message: 'wallpaper successfully updated', likes: wallpaper.likes});
    } catch (error) {
        if(error) errorHandler(error, res);
    }
});

router.post("/dislike/:wallpaper_uuid", auth, async (req, res) => {
    try {
        const wallpaper = await db.wallpapers.update({uuid: req.params.wallpaper_uuid}, {$pull: { 'likes': req.user.uuid }});
        res.status(200).json({message: 'wallpaper successfully updated', likes: wallpaper.likes});
    } catch (error) {
        if(error) errorHandler(error, res);
    }
});

router.post("/save/:wallpaper_uuid", auth, async (req, res) => {
    try {
        const wallpaper = await db.wallpapers.update({uuid: req.params.wallpaper_uuid}, {$addToSet: { 'saves': req.user.uuid }});
        res.status(200).json({message: 'wallpaper successfully updated', saves: wallpaper.saves});
    } catch (error) {
        if(error) errorHandler(error, res);
    }
});

router.post("/unsave/:wallpaper_uuid", auth, async (req, res) => {
    try {
        const wallpaper = await db.wallpapers.update({uuid: req.params.wallpaper_uuid}, {$pull: { 'saves': req.user.uuid }});
        res.status(200).json({message: 'wallpaper successfully updated', saves: wallpaper.likes});
    } catch (error) {
        if(error) errorHandler(error, res);
    }
});

router.get("/download/:wallpaper_uuid", async (req, res) => {
    try {
        const wallpaper = (await db.wallpapers.find({uuid: req.params.wallpaper_uuid}))[0];
        if (wallpaper == null) return res.status(404).json({message: "wallpaper not found in database"});
        db.wallpapers.update({uuid: req.params.wallpaper_uuid}, {$inc: { 'downloads': 1 }});
                                 // Path of where the file is             // The named file the user gets
        res.status(200).download(`./db/wallpapers/${wallpaper.fileName}`, wallpaper.fileName);
    } catch (error) {
        if(error) errorHandler(error, res);
    }
});

module.exports = router 
const express = require('express');
const db = require("../handlers/database.js");
const multer = require("multer");
const upload = multer({ dest: "./db/uploads/" });
const auth = require("../middlewares/auth.js");
const taku = require("../handlers/classes.js");
const Jimp = require("jimp");
const fs = require("fs");

const { Readable } = require('stream');
const router = express.Router();

function errorHandler(error, res){
    error = error.toString();
    res.status(500).json({message: 'error updating wallpaper in database', error});
}

router.get("/:uuid", async (req, res) => {
    const wallpaper = await db.wallpapers.aggregate([
        {'$match':   {'uuid': req.params.uuid}},
        {'$lookup':  {'from': 'users', 'localField': 'submitter.uuid', 'foreignField': 'uuid', 'as': 'submitter' } },
        {'$project': {'_id': 0, 'submitter._id': 0, 'submitter.settings': 0, 'submitter.following': 0, 'submitter.friend_list': 0, 'submitter.created_at': 0, 'submitter.profile.isDeveloper': 0, 'submitter.profile.isBetaTester': 0, 'submitter.profile.pfp': 0, 'submitter.profile.banner': 0, 'submitter.profile.anime_list': 0, 'submitter.profile.socials': 0, 'submitter.profile.description': 0, 'submitter.profile.connections': 0, 'submitter.profile.order': 0 } },
        {'$unwind':  {'path': '$submitter', 'preserveNullAndEmptyArrays': true }},
    ]);
    console.log(wallpaper[0]);
    res.status(200).json(wallpaper[0]);
});

// https://taku.moe:2087/wallpapers/static/1615252430325-4ef93bfb8dfe14681d3f50ed4e03290b.jpg?width=34534&height=23534
// router.get("/static/:filename", async (req, res) => {
//     const fileToServe = req.params.filename;
//     const reqWidth = parseInt(req.query.width);
//     const reqHeight = parseInt(req.query.height);

//     if (!fileToServe) return res.status(404).json({message: 'file not found'});

//     Jimp.read(`./db/wallpapers/${fileToServe}`, async (err, image) => {
//         if (err) throw err;
//         if (!reqWidth && !reqHeight) {
//             res.setHeader('Content-Type', image._originalMime);
//             const readable = new Readable();
//             readable._read = () => {} // _read is required but you can noop it
//             readable.push(await image.getBufferAsync(image._originalMime))
//             readable.push(null)
//             readable.pipe(res)
//             return
//         }

//         if (image.bitmap.width > reqWidth && !reqHeight) image.resize(reqWidth, Jimp.AUTO);
//         else if (image.bitmap.width > reqWidth && reqHeight) image.resize(reqWidth, reqHeight);   
//         else if (image.bitmap.height > reqHeight && !reqWidth) image.resize(Jimp.AUTO, reqHeight);

//         res.setHeader('Content-Type', image._originalMime);
//         const readable = new Readable();
//         readable._read = () => {}; // _read is required but you can noop it
//         readable.push(await image.getBufferAsync(image._originalMime))
//         readable.push(null)
//         readable.pipe(res)
//     });
// });

router.get("/random/:amount", async (req, res) => {
    const wallpapers = await db.wallpapers.aggregate([
        {'$sample': {'size': parseInt(req.params.amount)}},
        {'$sort' :  {'likes': -1 }}
    ]);
    res.status(200).json({ wallpapers });
});

router.post("/", auth, upload.any(), async (req, res) => {
    if (!req.body.metadata) return res.status(400).json({message: 'missing metadata'});
    const metadata = JSON.parse(req.body.metadata);
    metadata.submitter.uuid = req.user.uuid;

    if (req.files) var image = req.files[0];
    else return res.status(400).json({message: 'missing image'});

    const jimpImage = await Jimp.read(`db/uploads/${image.filename}`);
    const fileName = `${new Date().getTime()}-${image.originalname}`;
    try {
        const wallpaper = new taku.Wallpaper(image, jimpImage, metadata);
        await db.wallpapers.insert(wallpaper);
        jimpImage.write(`db/wallpapers/${fileName}`);
        jimpImage.resize(Jimp.AUTO, 156);
        jimpImage.write(`db/wallpapers/static/${fileName}`);
        jimpImage.fileName = fileName;
        fs.unlink(`db/uploads/${image.filename}`, () => {}); // Delete original file from uploads folder since we moved it to its correct folder
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
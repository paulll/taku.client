const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const auth = require("../middlewares/auth.js");      // Import auth system
const Classes = require("../handlers/classes.js"); 

const router = express.Router();

router.get("/", auth, async (req, res) => {
  // let's not talk about this aggregate function
  let channels = await db.channels.aggregate([
      { '$match': { 'member_list': { '$in': [req.user.uuid] } } },
      { '$lookup': { 'from': 'users', 'localField': 'member_list', 'foreignField': 'uuid', 'as': 'member_list' } },
      { '$project': { '_id': 0, 'member_list._id': 0, 'member_list.settings': 0, 'member_list.following': 0, 'member_list.friend_list': 0, 'member_list.created_at': 0, 'member_list.profile.isDeveloper': 0, 'member_list.profile.isBetaTester': 0, 'member_list.profile.pfp': 0, 'member_list.profile.banner': 0, 'member_list.profile.anime_list': 0, 'member_list.profile.socials': 0, 'member_list.profile.description': 0, 'member_list.profile.connections': 0, 'member_list.profile.order': 0 } },
      { '$lookup': { 'from': 'messages', 'localField': 'last_message', 'foreignField': 'uuid', 'as': 'last_message' } },
      { '$unwind': { 'path': '$last_message', 'preserveNullAndEmptyArrays': true } },
      { '$sort' : { 'last_message.created_at' : -1 } }
  ]);
  res.status(200).json({ "channels": channels });
});

router.get("/:channel_uuid", auth, async (req, res) => {
  const channel = (await db.channels.find({ uuid: req.params.channel_uuid }))[0];
  if (channel && !channel.member_list.includes(req.user.uuid)) {
      res.status(401).json({ "message": 'Forbidden' });
      return;
  }
  res.status(200).json({ "channel": channel });
});

// Clean af optimized piece of database query
router.get("/:channel_uuid/:offset", auth, async (req, res) => {
  let response = (await db.messages.aggregate([
      { '$match': { 'channel_uuid': req.params.channel_uuid } },
      { '$sort': { 'created_at': -1 } },
      { '$skip': parseInt(req.params.offset) },
      { '$limit': 20 },
      { '$lookup': { 'from': 'users', 'localField': 'author', 'foreignField': 'uuid', 'as': 'author' } },
      { '$unwind': { 'path': '$author', 'preserveNullAndEmptyArrays': true } },
      { '$project': { '_id': 0, 'author.settings': 0, 'author.profile': 0, 'author.created_at': 0, 'author.friend_list': 0, 'author.following': 0, 'author._id': 0 } },
  ]));

  res.status(200).json(response);
});


router.post("/group/", auth, async (req, res) => {

  if (!req.body.participants) res.status(400).json({message: "missing participants"});

  const author = req.user.uuid;
  const participants = req.body.participants;
  const senpai = author;

  const newGroup = new Classes.GroupChannel(author, participants, undefined, senpai);
  
  console.log(newGroup);

  try {
    let response = await db.channels.insert(newGroup);
    res.status(201).json({message: "group created successfully"});
  } catch (error) {
    if (error) res.status(500).json({message: "something went wrong while inserting the group into the database", stacktrace: error});
  }

});


module.exports = router
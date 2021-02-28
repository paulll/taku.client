const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const auth = require("../middlewares/auth.js");      // Import auth system

const router = express.Router();

router.get("/", auth, async (req, res) => {
  // let's not talk about this aggregate function
  let channels = await db.channels.aggregate([
      { '$match': { 'memberList': { '$in': [req.user.uuid] } } },
      { '$lookup': { 'from': 'users', 'localField': 'memberList', 'foreignField': 'uuid', 'as': 'memberList' } },
      { '$project': { '_id': 0, 'memberList._id': 0, 'memberList.settings': 0, 'memberList.following': 0, 'memberList.friend_list': 0, 'memberList.created_at': 0, 'memberList.profile.isDeveloper': 0, 'memberList.profile.isBetaTester': 0, 'memberList.profile.pfp': 0, 'memberList.profile.banner': 0, 'memberList.profile.anime_list': 0, 'memberList.profile.socials': 0, 'memberList.profile.description': 0, 'memberList.profile.connections': 0, 'memberList.profile.order': 0 } },
      { '$lookup': { 'from': 'messages', 'localField': 'lastMessage', 'foreignField': 'uuid', 'as': 'lastMessage' } },
      { '$unwind': { 'path': '$lastMessage', 'preserveNullAndEmptyArrays': true } },
  ]);
  res.status(200).json({ "channels": channels });
});

router.get("/:channel_uuid", auth, async (req, res) => {
  const channel = (await db.channels.find({ uuid: req.params.channel_uuid }))[0];
  if (!channel.memberList.includes(req.user.uuid)) {
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

module.exports = router
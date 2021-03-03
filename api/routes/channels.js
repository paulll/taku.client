const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const auth = require("../middlewares/auth.js");      // Import auth system
const Classes = require("../handlers/classes.js"); 

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
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

router.get("/:channel_uuid", async (req, res) => {
  let channel = (await db.channels.aggregate([
      { '$match': { 'uuid': { '$in': [req.params.channel_uuid] } } },
      { '$lookup': { 'from': 'users', 'localField': 'member_list', 'foreignField': 'uuid', 'as': 'member_list' } },
      { '$project': { '_id': 0, 'member_list._id': 0, 'member_list.settings': 0, 'member_list.following': 0, 'member_list.friend_list': 0, 'member_list.created_at': 0, 'member_list.profile.isDeveloper': 0, 'member_list.profile.isBetaTester': 0, 'member_list.profile.pfp': 0, 'member_list.profile.banner': 0, 'member_list.profile.anime_list': 0, 'member_list.profile.socials': 0, 'member_list.profile.description': 0, 'member_list.profile.connections': 0, 'member_list.profile.order': 0 } },
      { '$lookup': { 'from': 'messages', 'localField': 'last_message', 'foreignField': 'uuid', 'as': 'last_message' } },
      { '$unwind': { 'path': '$last_message', 'preserveNullAndEmptyArrays': true } },
      { '$sort' : { 'last_message.created_at' : -1 } }
  ]))[0];

  // If the user isn't part of that channel reject their view
  if (channel && !channel.member_list.some(user => user.uuid == req.user.uuid)) {
      res.status(401).json({ "message": 'Forbidden' });
      return;
  }

  res.status(200).json({ "channel": channel });
});

// Clean af optimized piece of database query
router.get("/:channel_uuid/:offset", async (req, res) => {
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


router.post("/group/", async (req, res) => {
  const author = req.user.uuid;
  const participants = [];
  req.body.participants ? participants = req.body.participants : [];
  const senpai = author;
  const name = req.body.name;
  
  const newGroup = new Classes.GroupChannel(author, [author, ...participants], undefined, name);
  
  try {
    const channel = await db.channels.insert(newGroup);
    res.status(201).json({message: "group created successfully", channel: channel});
  } catch (error) {
    if (error) res.status(500).json({message: "something went wrong while inserting the group into the database", stacktrace: error});
  }

});

router.delete("/group/:channel_uuid", async (req, res) => {
  await db.channels.remove({uuid: req.params.channel_uuid});
  res.status(200).json({message: "group successfully deleted"});
});

router.get("/invites/", async (req, res) => {
  const invites = await db.invites.find({to: req.user.uuid});
  res.status(200).json({invites: invites});
});

router.post("/invite/", async (req, res) => {
  const usersToInvite = req.body.usersToInvite;
  const channel = req.body.channel_uuid;

  for (user of usersToInvite) {
    const invite = new Classes.Invite(user, req.user.uuid, req.body.channel_uuid);
    await db.invites.insert(invite);
    io.sockets.in(user).emit("invite", channel);
    console.log(invite);
  }
  res.status(200).json({message: "invited successfully"});
});


module.exports = router
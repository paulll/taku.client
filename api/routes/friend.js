const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const Classes = require("../handlers/classes.js");    // Import Constructor classes
const auth = require("../middlewares/auth.js");       // Import auth system

const io = require('../index.js');

const router = express.Router();

// Friend Requests 
const acceptFriendRequest = (me, userToAccept) => {
  return new Promise(async (resolve, reject) => {
      // Add the other users uuid to my pending list
      await db.users.update(
          { uuid: me.uuid },
          { $pull: { 'friend_list.incoming': userToAccept } },
      );

      // Add the other user to my friends
      await db.users.update(
          { uuid: me.uuid },
          { $addToSet: { 'friend_list.friends': userToAccept } }
      );

      // Add my uuid to the other users pending list
      await db.users.update(
          { uuid: userToAccept },
          { $pull: { 'friend_list.outgoing': me.uuid } },
      );

      // Add me.uuid to their friends
      await db.users.update(
          { uuid: userToAccept },
          { $addToSet: { 'friend_list.friends': me.uuid } }
      );

      // Create a new DM for those users
      // Check if database contains a channel, which member_list contains these uuids
      const checkedChannel = (await db.channels.aggregate([
          { '$match': { 'type': 'dm' } }, 
          { '$match': { 'member_list': { '$in': [me.uuid] } } }, 
          { '$match': { 'member_list': { '$in': [userToAccept] } } }
      ]))[0];

      // If there isn't a channel for those 2 users already, make a new one
      if (!checkedChannel) {
          const newChannel = new Classes.Channel(me.uuid, [userToAccept]);
          await db.channels.insert(newChannel);
      };

      // Create the notification
      let notification = new Classes.Notification("Friend Request", { uuid: me.uuid, username: me.username }, `Accepted your friend request!`);

      // Send event to the specific user
      io.sockets.in(userToAccept).emit('notification', notification);

      resolve();
  });
}

// Messages
router.post("/add", auth, async (req, res) => { // Add a friend
  let me = req.user
  let userToAdd = req.body.uuid

  if (me.friend_list.incoming.includes(userToAdd)) {
      await acceptFriendRequest(me, userToAdd);
      res.status(200).json({ "message": "Friend Request Accepted" });
      return
  };

  // Add the other users uuid to my pending list
  await db.users.update(
      { uuid: me.uuid },
      { $addToSet: { 'friend_list.outgoing': userToAdd } }
  );

  // Create the notification
  let notification = new Classes.Notification("Friend Request", { uuid: me.uuid, username: me.username }, `Sent you a friend request!`);

  // Send event to the specific user
  // console.log("[Notification WS] Emitting New".red, me.uuid.red);
  io.sockets.in(userToAdd).emit('notification', notification);

  await db.notifications.update(
      { owner_uuid: userToAdd },
      { $push: { 'list': notification } }
  );

  // Add my uuid to the other users pending list
  await db.users.update(
      { uuid: userToAdd },
      { $addToSet: { 'friend_list.incoming': me.uuid } }
  );

  res.status(200).json({ "message": "Friend Request Sent" });
});
router.post("/remove", auth, async (req, res) => { // Remove a friend
  let me = req.user.uuid;
  let userToRemove = req.body.uuid

  // Add the other users uuid to my pending list
  await db.users.update(
      { uuid: me },
      { $pull: { 'friend_list.friends': userToRemove } }
  );

  // Add my uuid to the other users pending list
  await db.users.update(
      { uuid: userToRemove },
      { $pull: { 'friend_list.friends': me } }
  );

  res.status(200).json({ "message": "Friend Removed" });
});
router.post("/cancel", auth, async (req, res) => { // Cancel a friend request
  let me = req.user.uuid;
  let userToRemove = req.body.uuid

  // Add the other users uuid to my pending list
  await db.users.update(
      { uuid: me },
      { $pull: { 'friend_list.outgoing': userToRemove } }
  );

  // Add my uuid to the other users pending list
  await db.users.update(
      { uuid: userToRemove },
      { $pull: { 'friend_list.incoming': me } }
  );

  res.status(200).json({ "message": "Friend Request Cancelled" });
});
router.post("/accept", auth, async (req, res) => { // Accept a friend
  let me = req.user;
  let userToAccept = req.body.uuid
  acceptFriendRequest(me, userToAccept);

  res.status(200).json({ "message": "Friend Request Accepted" });
});
router.post("/deny", auth, async (req, res) => { // Deny a friend

  let me = req.user.uuid;
  let userToRemove = req.body.uuid

  // Remove other persons uuid from your incoming list
  await db.users.update(
      { uuid: me },
      { $pull: { 'friend_list.incoming': userToRemove } }
  );

  // Remove my uuid from other persons outgoing list
  await db.users.update(
      { uuid: userToRemove },
      { $pull: { 'friend_list.outgoing': me } }
  );

  res.status(200).json({ "message": "Friend Request Denied" });
});

module.exports = router
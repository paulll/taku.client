const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const auth = require("../middlewares/auth.js");      // Import auth system
const multer = require("multer");
const upload = multer({ dest: "./db/uploads/" });
const Classes = require("../handlers/classes.js");    // Import Constructor classes
const clusters = require('../handlers/clusters.js');  // Import clusterHandler, currently used for image processing

const io = require('../index.js');

const router = express.Router();

router.post("/", auth, upload.any(), async (req, res) => {
    const messageEvent = JSON.parse(req.body.message);
    const channelEvent = JSON.parse(req.body.channel);
    // Load the channel from the database
    let channel = (await db.channels.find({ 'uuid': channelEvent.uuid }))[0];
    channel.type = channelEvent.type;

    // Check if the user is a member of that channel
    if (!channel.member_list.includes(req.user.uuid)) return res.status(401).json({ "message": "Forbidden" });

    // Process attachments if any
    let attachments = [];
    if (req.files.length !== 0) attachments = await clusters.cacheImages(req.files);
    
    // Create new message
    let message = new Classes.Message(req.user.uuid, messageEvent.content, channel.uuid, attachments);

    await db.messages.insert(message); // Add to message database
    await db.channels.update({ 'uuid': channel.uuid }, { "$set": { 'last_message': message.uuid } }); // Add to message to the channel it belongs to

    // If the user is a member of that channel
    res.status(201).json({ "message": "message created" });

    message = (await db.messages.aggregate([
        {'$match': {"uuid": message.uuid}},
        {'$lookup': {'from': 'users','localField': 'author','foreignField': 'uuid','as': 'author'}},
        {'$unwind': {'path': '$author','preserveNullAndEmptyArrays': true}},
        {'$project': { '_id': 0, 'author.settings': 0, 'author.profile': 0, 'author.created_at': 0, 'author.friend_list': 0, 'author.following': 0, 'author._id': 0 } }
    ]))[0];

    // socket.broadcast.emit("message", message);  // Send to all other users
    // socket.emit("message", message);            // Send to current user

    // Create the notification
    let notification = new Classes.Notification("Message", { uuid: req.user.uuid, username: req.user.username }, message.content, undefined, channel, message.attachments.length);

    for (member of channel.member_list) {
        if (member != req.user.uuid) {
            // Send event to the specific users
            await db.notifications.update(
                { owner_uuid: member },
                { $push: { 'list': notification } }
            );
            
            io.sockets.in(member).emit('notification', notification);
        }
    }

    // Send event to the specific user
    io.sockets.in(channel.uuid).emit('message', message);
});

module.exports = router;


// socket.on("typing", typingEvent => {
//   // Verify JWT
//   jwt.verify(typingEvent.user, "h4x0r", async (error, user) => {

//     if (error) return

//     // Get user's data from db
//     user = (await db.users.find({username: user.username }, { collation: { locale: "en", strength: 2 } }))[0];

//     // Create a typing user object
//     let typingUser = {
//       uuid: user.uuid,
//       pfp: user.profile.pfp
//     };

//     // Besides the client who is typing
//     socket.broadcast.emit("typingUser", typingUser);
//   });
// });
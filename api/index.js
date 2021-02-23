const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const cors = require("cors");
const { date } = require("joi");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "./db/uploads/" });
var http = require("http");
const Jimp = require("jimp");
const Joi = require("joi");
const si = require("systeminformation"); 
const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid"); 
const axios = require('axios');
const colors = require('colors');
const child_process = require('child_process');

// OAuth keys, etc
const osuKey = '4fhm7Z3QT1itZjWqfVSoISHUJHwhOTkwhKu3FTJ6';
const osuClientId = '5478';

// const options = {
//     key: fs.readFileSync("./key.pem"),
//     cert: fs.readFileSync("./cert.pem")
// };


const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+$]{3,30}")).required(),
  repeat_password: Joi.ref("password"),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
});

// Database
var monk = require("monk");
const url = "localhost:27017/anihuu";
const db = monk(url);
db.then(() => {
  console.log(`Connected to database ${url}`);
});

// Database Collections
let users = db.get("users");

// users.update({}, { "$set": { 'settings.language': 'en'}},{multi:true});

let messages = db.get("messages");
let dms = db.get("dms");
let anime = db.get("anime");
let notifications = db.get("notifications");

// API
var app = express();
var http = require("http").createServer(app);

var io = require("socket.io")(http, {
  cors: { origin: "*" },
});

app.use(
  cors({
    origin: "http://taku.moe:8080",
    credentials: true,
  })
);

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("db"));
app.use(express.static("uploads"));
app.use(cookieParser());

// Functions
async function createToken(user, res) {
  user = user[0]

  const payload = {
    uuid: user.uuid,
    username: user.username,
  };

  jwt.sign(payload, "h4x0r", { expiresIn: "30d" }, (err, token) => {
    console.log(token);
    res.cookie("token", token);
    res.json({
      message: "Logged in",
      token: token,
      uuid: user.uuid,
      user: user
    });
    res.status(200);
  });
}
async function cacheImage(attachment, uuid, isMessage){
  return new Promise((resolve, reject) => { 

    console.log('Processing Image'.cyan);
    Jimp.read(`./db/uploads/${attachment.filename}`, async (err, image) => {
      if (err) throw err;
      if (image.bitmap.width > 368) {
        image.resize(Jimp.AUTO, 368) // resize
      }

      if(!isMessage) image.write(`./db/${attachment.fieldname}/cache/${uuid}`); // save
      else image.write(`./db/uploads/cache/${attachment.originalname}`); // save
      
      resolve("Image url" + `./db/uploads/cache/${attachment.originalname}`);
    });
  });
}


async function cacheImages(attachments){
  return new Promise(resolve => {
    // var numchild = require('os').cpus().length;
    var done = 0;
    let cachedAttachments = [];

    for (var i = 0; i < attachments.length; i++){
      var imageProcessor = child_process.fork('./clusters/imageProcessor');
      imageProcessor.send(attachments[i]);
      imageProcessor.on('message', cachedAttachment => {
        console.log('[PARENT]: Received message from child:', cachedAttachment.result);
        cachedAttachments.push(cachedAttachment.result);
        done++;
        if (done === attachments.length) {
          console.log('[PARENT]: Received all results!');
          resolve(cachedAttachments);
        }
      });
    };
  });
};

// Online users
let onlineUsers = [];

// This only runs when some user sends a heartbeat, it updates everyone as long as there is at least 1 user online
async function addToOnlineUsers(uuid) {
  
  // Update user last seen in their db
  let newLastSeen = new Date().getTime();
  await users.update({'uuid': uuid}, { "$set": {'profile.status.lastSeen': newLastSeen}});

  // Check if the user is already in there
  const found = onlineUsers.some(user => user.uuid == uuid);

  // If they aren't, add them
  if (!found) onlineUsers.push({ uuid: uuid, lastSeen: newLastSeen})

  // Otherwise if they are found, update their lastSeen
  else {
    onlineUsers = onlineUsers.map(user => {

      // Remove old users that havent been seen for more than 60 sec
      if (user.lastSeen + 120000 < newLastSeen) {
        // console.log(`${"Heartbeat:".bgRed.white} Timeout clearing: ${user.uuid}`);
        return undefined;
      }

      // Find where the user that heartbeated is in the array and update their last seen
      if (user.uuid == uuid) {
        // console.log(`${"Heartbeat:".bgRed.white} Updating: ${user.uuid}`);
        return ({uuid: user.uuid, lastSeen: newLastSeen });
      }

      // And return the rest untouched
      return user
    }).filter(user => user !== undefined);
  }

  return onlineUsers;
}

// Function that creates a new user with default values
// C O N S T R U C T O R 🐂🐂🐂🐂🐂🐂🐂
function User(username, email, password) {
  this.username = username;
  this.uuid = uuidv4();
  this.created_at = new Date().getTime();
  this.profile = {
    status: {
      lastSeen: new Date().getTime(),
    },
    isDeveloper: false,
    isBetaTester: false,
    pfp: "http://taku.moe:8880/pfp/_default.png",
    banner: "http://taku.moe:8880/banner/_default.png",
    description: "Hi I love anime owo!",
    anime_list: [],
    socials: {},
    connections: {},
  };
  this.following = [];
  this.friend_list = {
    friends: [],
    incoming: [],
    outgoing: [],
  };
  this.settings = {
    show_nsfw: false,
    account: {
        email: email,
        password: password,
    },
    language: "en",
    appearance: {                                                               
        darkmode: false,
        animate_pfps: true,
        theme_color: "#fe7692",
        flare: {
            enabled: false,
            content: "",
            color: ""
        }       
    },
    sounds: {
        typing: { 
            enabled: true,
            url: "" 
        },
        mention: { 
            enabled: true,
            url: "" 
        },
        notification: { 
            enabled: true,
            url: "" 
        },
        hover: { 
            enabled: false,
            url: "" 
        },
        click: { 
            enabled: false,
            url: "" 
        },
    },
    connections: {},
    notifications: {
        disable_all: false,
        messages: true,
        posts: true,
        comments: true,
        friend_requests: true,
        follows: true,
        emails: true
    },
    privacy: {
        show_status: true,
        blocked_users: []
    },
  }
};

// Constructor for new notifications
function Notification(type, from, content, post_uuid, channel_uuid){

  // Throw errors if trying to add dumb notifications with missing parameters
  if (!type) return new Error("'type' must be provided for notifications");
  if (!from) return new Error("'from' must be provided for post notifications");

  switch (type) {
    case "Friend Request":
      if (!from) return new Error("'from' must be provided for friend request notifications ");
    break;
    case "Comment":
      if (!post_uuid) return new Error("'post_uuid' must be provided for comment notifications");
      if (!content) return new Error("Content must provided for comment notifications");
      break;
    case "Message":
      if (!channel_uuid) return new Error("'channel_uuid' must be provided for message notifications");
      if (!content) return new Error("'content' must provided for message notifications");
      break;
    case "Post":
      if (!post_uuid) return new Error("'post_uuid' must be provided for post notifications");
      break;
  }

  this.uuid = uuidv4();
  this.type = type;
  this.from = {
    uuid: from.uuid,
    username: from.username,
  };
  this.created_at = new Date().getTime();
  this.read = false;
  this.show = true;
  if (content) this.content = content;
  if (post_uuid) this.post_uuid = post_uuid;
  if (channel_uuid) this.channel_uuid = channel_uuid;
}

// Friend Requests 
function acceptFriendRequest(me, userToAccept){
  return new Promise(async (resolve, reject) => {
    // Add the other users uuid to my pending list
    await users.update(
      { uuid: me.uuid },
      { $pull: { 'friend_list.incoming': userToAccept } },
    );

    // Add the other user to my friends
    await users.update(
      { uuid: me.uuid },
      { $addToSet: { 'friend_list.friends': userToAccept} }
    );

    // Add my uuid to the other users pending list
    await users.update(
      { uuid: userToAccept },
      { $pull: { 'friend_list.outgoing': me.uuid} },
    );

    // Add me.uuid to their friends
    await users.update(
      { uuid: userToAccept },
      { $addToSet: { 'friend_list.friends': me.uuid} }
    );

    console.log(me);
    // Create the notification
    let notification = new Notification("Friend Request", {uuid: me.uuid, username: me.username}, `Accepted your friend request!`);
    // Send event to the specific user
    console.log(notification);
    io.sockets.in(userToAccept).emit('notification', notification);

    resolve();
  });
}

const currentMessages = [];

let totalConnections = 0;

let currentLoad = 0;
let ramUsage = 0;

setInterval(async () => {
  currentLoad = parseInt((await si.currentLoad()).currentLoad.toFixed(0));
  ramUsage = Math.floor(process.memoryUsage().heapUsed / 1000 );
}, 1000);

// Middleware
let authJWT = (req, res, next) => {
  jwt.verify(req.cookies.token, "h4x0r", async (error, user) => {

    if (error) {
      console.log(error);
      res.status(403);
      res.json({
        message: "You must be logged in to view your user info idiot 🖕🖕🖕",
      });
      return;
    }

    console.log(user.uuid);

    // Get user's data from db
    req.user = (await users.aggregate([
      {
        '$match': {
          'uuid': `${user.uuid}`
        }
      }, {
        '$lookup': {
          'from': 'notifications', 
          'localField': 'uuid', 
          'foreignField': 'owner_uuid', 
          'as': 'notifications'
        }
      }
    ]))[0];
    next();
  });
};


let notificationRoom = '';

// Websockets
io.on("connection", socket => {
  socket.emit("message", "Connected to taku DMs");
  socket.emit("messages", currentMessages);
  
  totalConnections++;

  // console.log(`Total Connections: ${totalConnections}`);
  
  socket.on("ping", () => {
    socket.emit("pong", {cpu: currentLoad, ram: ramUsage });
  });

  // Connect the user to their own unique room for notifications
  socket.on("room", room => {
    console.log("New room".red, room.red);
    socket.join(room);
  });

  // Messages

  app.post("/friend/add", authJWT, async (req, res) => { // Add a friend
    let me = req.user
    let userToAdd = req.body.uuid
    
    if (me.friend_list.incoming.includes(userToAdd)) {
      await acceptFriendRequest(me, userToAdd);
      res.status(200);
      res.json({"message": "Friend Request Accepted"});
      return
    };
  
    // Add the other users uuid to my pending list
    await users.update(
      { uuid: me.uuid },
      { $addToSet: { 'friend_list.outgoing': userToAdd } }
    );
  
    // Create the notification
    let notification = new Notification("Friend Request", {uuid: me.uuid, username: me.username}, `Sent you a friend request!`);
  
    console.log(notification);

    // Send event to the specific user
    io.sockets.in(userToAdd).emit('notification', notification);
  
    await notifications.update(
      { owner_uuid: userToAdd },
      { $push: { 'list': notification} }
    );
  
    // Add my uuid to the other users pending list
    await users.update(
      { uuid: userToAdd },
      { $addToSet: { 'friend_list.incoming': me.uuid} }
    );
  
    res.status(200);
    res.json({"message": "Friend Request Sent"});
  });


  app.post("/friend/remove", authJWT, async (req, res) => { // Remove a friend
   let me = req.user.uuid;
   let userToRemove = req.body.uuid
   
   // Add the other users uuid to my pending list
   await users.update(
     { uuid: me },
     { $pull: { 'friend_list.friends': userToRemove } }
   );
  
   // Add my uuid to the other users pending list
   await users.update(
     { uuid: userToRemove },
     { $pull: { 'friend_list.friends': me} }
   );
  
   res.status(200);
   res.json({"message": "Friend Removed"});
  });


  app.post("/friend/cancel", authJWT, async (req, res) => { // Cancel a friend request
    let me = req.user.uuid;
    let userToRemove = req.body.uuid
    
    // Add the other users uuid to my pending list
    await users.update(
      { uuid: me },
      { $pull: { 'friend_list.outgoing': userToRemove } }
    );
    
    // Add my uuid to the other users pending list
    await users.update(
      { uuid: userToRemove },
      { $pull: { 'friend_list.incoming': me} }
    );
    
    res.status(200);
    res.json({"message": "Friend Request Cancelled"});
  });


  app.post("/friend/accept", authJWT, async (req, res) => { // Accept a friend
    let me = req.user;
    let userToAccept = req.body.uuid
    acceptFriendRequest(me, userToAccept);

    res.status(200);
    res.json({"message": "Friend Request Accepted"});
  });

  
  app.post("/friend/deny", authJWT, async (req, res) => { // Deny a friend
    
    let me = req.user.uuid;
    let userToRemove = req.body.uuid
    
    // Remove other persons uuid from your incoming list
    await users.update(
      { uuid: me },
      { $pull: { 'friend_list.incoming': userToRemove } }
    );
    
    // Remove my uuid from other persons outgoing list
    await users.update(
      { uuid: userToRemove },
      { $pull: { 'friend_list.outgoing': me} }
    );
    
    res.status(200);
    res.json({"message": "Friend Request Denied"});
  });
  // The reason i use a normal post method here is because
  // apparently theres a 1mb limit to a ws header
  // therefore if people want to send images that are bigger
  // than 1mb we have to use a traditional post method
  // it still can emit the socket for whenever we get a message
  app.post("/message", upload.any(), async (req, res) => {

    let messageEvent = JSON.parse(req.body.message);
    messageEvent.attachments = req.files;
  
    res.json({"message": "got message"});
  
    if (!messageEvent.user) return;
    if (!messageEvent.attachments) return;
    if (messageEvent.attachments.length == 0 && messageEvent.content.length == 0) return;
    
    let author = {};
  
    // Verify Logged In User
    jwt.verify(messageEvent.user, "h4x0r", async (error, user) => {
      if (error) {
        console.log(error);
      }
      author = (
        await users.find(
          { uuid: user.uuid },
          { collation: { locale: "en", strength: 2 } }
        )
      )[0];
  
      if (!author) return

      let attachments = await cacheImages(req.files);

      // Construct message object
      const message = {
        content: messageEvent.content,
        attachments: attachments,
        date: new Date().getTime(),
        author: {
          username: author.username,
          flare: author.settings.appearance.flare,
          pfp: author.profile.pfp ? author.profile.pfp : author.pfp,
        },
      };
  
      console.log(message);

      message["content"] = message.content;
  
      currentMessages.push(message);
      if (currentMessages.length > 20) currentMessages.shift();
  
      // Add to database
      messages.insert(message);

      // Send to all other users
      socket.broadcast.emit("message", message);
  
      // Send to current user
      socket.emit("message", message);
    });
  });

  socket.on("typing", typingEvent => {
    // Verify JWT
    jwt.verify(typingEvent.user, "h4x0r", async (error, user) => {

      if (error) return

      // Get user's data from db
      user = (await users.find({username: user.username }, { collation: { locale: "en", strength: 2 } }))[0];

      // Create a typing user object
      let typingUser = {
        uuid: user.uuid,
        pfp: user.profile.pfp
      };

      // Besides the client who is typing
      socket.broadcast.emit("typingUser", typingUser);
    });
  });
  socket.on("heartbeat", heartbeat => {
    jwt.verify(heartbeat.user, "h4x0r", async (error, user) => {
      if (!user || user === undefined) return

      // Add user to onlineUsers list
      addToOnlineUsers(user.uuid);
      // console.log(onlineUsers);
      // console.log(onlineUsers.length.toString().green + " users online");
    });
  });
  socket.on("disconnect", () => {
    totalConnections--;
    // console.log(`WS Connections: ${totalConnections}`);
  });
});

// io.on("room", room => {
//   console.log("ROOM:".red, room);
//   notificationRoom = room;
//   socket.join(room);
// });


// Routes
app.get("/", (req, res) => {
  res.status(200);
  res.send(
    JSON.stringify({
      message: "hello",
    })
  );
});

app.get("/ping", async (req, res) => {
  res.status(200);
  res.json({status: "200", message: "pong"});
});

// User Endpoints
app.get("/user/:username", async (req, res) => {
  
  // Get user
  const user = (await users.find(
    { username: req.params.username },
    { collation: { locale: "en", strength: 2 } }
  ))[0];

  // Add their statuses
  if (user) {
    if (onlineUsers.some(onlineUser => onlineUser.uuid == user.uuid)) {
      user.profile.status.isOnline = true
    }
    else {
      user.profile.status.isOnline = false
    }
  }

  res.status(200);
  res.json(user);
});

app.get("/user", authJWT, async (req, res) => {
  res.status(200);
  res.json(req.user);
});

app.delete("/notifications", authJWT, async (req, res) => {
  // Remove other persons uuid from your incoming list
  await notifications.update(
    { owner_uuid: req.user.uuid },
    { $set: { list: []}}
  );

  res.status(200);
  res.json(req.user);
});

app.post("/user/computer", async (req, res) => {
  // Parse body
  const body = req.body;

  // Verify Logged In User
  jwt.verify(body.user, "h4x0r", async (error, user) => {
    if (error) {
      console.log(error);
    }
    req.user = user;

    await users.update(
      { username: req.user.username },
      { $set: { 'profile.computer' : req.body.computer } }
    );

    res.status(200);
    res.json({ message: "done" });
  });
});
app.post("/user/anime", authJWT, async (req, res) => {

  const anime_id = req.body.anime;
  
  console.log(anime_id);

  if (req.body.action == true) {
    await users.update(
      { uuid: req.user.uuid },
      { $addToSet: { "profile.anime_list" : anime_id } }
    );
  }
  else if (req.body.action == false){
    await users.update(
      { uuid: req.user.uuid },
      { $pull: { "profile.anime_list" : anime_id } }
    );
  }

  if (req.body.isSignup == true) {
    await users.update(
      { uuid: req.user.uuid },
      { $set: { "profile.anime_list" : anime_id } }
    );
  }

  res.status(200);
  res.json({ message: `Anime ${anime_id} added to your favorites!` });
});
app.post("/user/socials", async (req, res) => {
  // Parse body
  const body = req.body;

  // Verify Logged In User
  jwt.verify(body.user, "h4x0r", async (error, user) => {
    if (error) {
      console.log(error);
    }
    req.user = user;

    await users.update(
      { username: req.user.username },
      { $set: { "profile.socials": body.socials } }
    );

    res.status(200);
    res.json({ message: "done" });
  });
});

app.get("/blockedUsers", authJWT, async (req, res) => {
  res.status(200);
  res.json(req.user.settings.privacy.blocked_users);
});

app.get("/dms", authJWT, async (req, res) => {
  res.status(200);
  res.json(req.user.dms);
});

// Setting Routes
app.post("/settings", authJWT, async (req, res) => {

    await users.update(
      { uuid: req.user.uuid },
      { $set: { profile: req.body.profile, settings: req.body.settings, friend_list: req.body.friend_list} }
    );

    res.status(200);
    res.json({"message": "Changes saved successfully"});
});
app.post("/settings/upload", authJWT, upload.any(), async (req, res) => {
  let file = req.files[0];
  file.originalname = `${new Date().getTime()}-${file.originalname.replace(/\s/g, "_")}`;

  let link = `http://taku.moe:8880/${file.fieldname}/${req.user.uuid}`;

  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    await cacheImage(file, req.user.uuid, false);
    link = `http://taku.moe:8880/${file.fieldname}/cache/${req.user.uuid}`;

    // Rename the file back to the original name cus multer is stupid
    fs.renameSync(`./db/uploads/${file.filename}`, `./db/${file.fieldname}/${req.user.uuid}`);
  } else {
    // Add the original image in the cache folder if its not a png/jpeg
    fs.copyFileSync(`./db/uploads/${file.filename}`, `./db/${file.fieldname}/cache/${req.user.uuid}`);
    fs.copyFileSync(`./db/uploads/${file.filename}`, `./db/${file.fieldname}/${req.user.uuid}`);
  }


  res.status(200);
  res.json({
    "status": 200,
    "message": "File uploaded successfully",
    "link": link,
  });
});

app.get("/message/:user_id", async (req, res) => {
  // Parse body
  const body = req.body;

  // Verify Logged In User
  jwt.verify(req.cookies.token, "h4x0r", (error, user) => {
    if (error) {
      console.log(error);
    }
    req.user = user;
  });

  const targetUser = (
    await users.find(
      { _id: req.params.user_id },
      { collation: { locale: "en", strength: 2 } }
    )
  )[0];
  if (targetUser) {
    dm = (
      await dms.find({ members: { $in: [targetUser._id, req.user._id] } })
    )[0];

    res.status(200);
    res.send({
      messages: dm.messages.map((message) => message.content),
    });
  } else {
    res.status(404);
    res.json({ message: "user not found" });
  }
});

// Search Endpoints
app.post("/search", async (req, res) => {

  let searchString = req.body.searchString.toLowerCase();

  const keywords = String.raw`.*${searchString}.*`;
  const animelist = await anime.find(
    { "title.english": new RegExp(keywords, "i") }
  );
  
  const userlist = await users.find(
    { username: {$regex:  new RegExp(keywords, "gi")} },
    { collation: { locale: "en", strength: 2 } }
  );

  let searchResults = {
    users: userlist,
    anime: animelist,
  }
  
  res.status(200);
  res.json(searchResults);

});
app.get("/search/anime/:name", async (req, res) => {
    const keywords = String.raw`.*${req.params.name}.*`;
    const animelist = await anime.find({ "title.english": new RegExp(keywords, "i") });
    res.status(200);
    res.json({ animelist: animelist });
});

// Anime Endpoints
app.get("/anime", async (req, res) => {
  const animelist = await anime.find();
  res.status(200);
  res.json({ animelist: animelist });
});
app.get("/anime/id/:id", async (req, res) => {
    const result = await anime.find({ id: parseInt(req.params.id) });
    res.status(200);
    res.json({ anime: result });
});

// Auth
app.post("/signup", async (req, res) => {
    // Parse body
    const body = req.body;

    // Validate the form
    try {
        var form = await schema.validateAsync(body);
    } catch (error) {
        console.log(error);
        res.status(400);
        res.json(error);
    }

    // Check if someone else has the same username
    if ((await users.find({ username: form.username }, { collation: { locale: "en", strength: 2 } })).length == 1) {
        res.status(200);
        res.json({ error: "Username already taken" });
        return;
    }

    // Check if the email is already bound to an account
    if ((await users.find({ email: form.email })).length == 1) {
        res.status(200);
        res.json({ error: "Email already exists" });
        return;
    }

    // Encrypt Passwords
    const hash = await bcrypt.hash(body.password, saltRounds);

    const user = new User(form.username, form.email, hash);
    console.log(user);

    // Make a new user with the values we got from the signup form and add to database
    await users.insert(user);
    await notifications.insert({owner_uuid: user.uuid, list: []});

    // Respond to user
    res.status(200);
    res.json(user); 
});
app.post("/login", async (req, res) => {
  // Parse body
  const body = req.body;

  const user = await users.find(
    { username: body.username },
    { collation: { locale: "en", strength: 2 } }
  );

    console.log(user[0].settings);

  // Try matching
  try {
    const match = await bcrypt.compare(body.password, user[0].settings.account.password);
    if (match) {
      createToken(user, res);
    }
    // If password doesn't match throw error
    else throw "error";
  } catch (error) {
    console.log(error);
    if (error) {
      res.status(200);
      res.json({ error: "Invalid Credentials ｡･ﾟﾟ*(>д<)*ﾟﾟ･｡" });
    }
  }
});

app.delete("/user/connection/:platform", authJWT, async (req, res) => {
  const plaform = req.params.platform;

  await users.update({'uuid': req.user.uuid}, { '$unset': {'profile.connections.osu': undefined , 'settings.connections.osu': undefined }});
  
  try {
    const deleteToken = await axios.delete("https://osu.ppy.sh/api/v2/oauth/tokens/current", {
      headers: {
        Authorization: `Bearer ${req.user.settings.connections.osu.token.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }}
    );

    res.status(200);
    res.json({"message": `Unlinked ${plaform} successfully`});
  } catch (error) {
    if (error) {
      res.status(500);
      res.json({"message": error.response.statusText});
    }
  }
});

app.post("/user/connection/:platform", authJWT, async (req, res) => {
  const plaform = req.params.platform;

  const oauthToken = req.body.code;

  const form = {
    grant_type: "authorization_code",
    client_id: osuClientId,
    client_secret: osuKey,
    redirect_uri: "http://taku.moe:8080/settings/connections",
    code: oauthToken
  };

  try {
    const verifyToken = await axios.post("https://osu.ppy.sh/oauth/token", JSON.stringify(form), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }}
    );

    if (verifyToken.status == 200) {
      // Security 🤵🏻🕵️🕵️🕵️
      // Not your token, it's OUR token :stalinApproves:
      await users.update({'uuid': req.user.uuid}, { '$set': {'settings.connections.osu.token': verifyToken.data }});

      const user = await axios.get("https://osu.ppy.sh/api/v2/me", {
        headers: {
          Authorization: `Bearer ${verifyToken.data.access_token}`
        }}
      );

      await users.update({'uuid': req.user.uuid}, { '$set': {'profile.connections.osu': user.data }});
    }

  } catch (error) {
    console.log(error);
  }
});


const port = process.env.PORT || 8880;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});




// `https://osu.ppy.sh/oauth/authorize?client_id=${osuClientId}?redirect_uri="http://taku.moe:8080/profile"`
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
var cors = require("cors");
const { date } = require("joi");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer({ dest: "./db/uploads/" });
var http = require("http");
var Jimp = require("jimp");
const Joi = require("joi");
const si = require("systeminformation"); 
const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid"); 
const axios = require('axios');
const colors = require('colors');
const osuKey = '6872281f03363bb78de4e7ee53cb574e05a1cbe6';

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

// Online users

let onlineUsers = [];

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
async function cacheImage(attachment){
  return new Promise((resolve, reject) => { 

    console.log('Processing Image'.cyan);
    Jimp.read(`./db/uploads/${attachment.filename}`, async (err, image) => {
      if (err) throw err;
      if (image.bitmap.width > 368) {
        image.resize(Jimp.AUTO, 368) // resize
      }

      await image.writeAsync(`./db/uploads/cache/${attachment.originalname}`); // save

      resolve();
    });
  });
}

function addToOnlineUsers(username) {

  // Check if the user is already in there
  const found = onlineUsers.some(el => el.username == username);

  // If they aren't, add them
  if (!found) onlineUsers.push({ username, lastSeen: new Date().getTime() });

  // Otherwise if they are found, update their lastSeen
  else {
    onlineUsers = onlineUsers.map(el => {

      // Remove old users that havent been seen for more than 60 sec
      if (el.lastSeen + 120000 < new Date().getTime()) {
        // console.log(`${"Heartbeat:".bgRed.white} Timeout clearing: ${el.username}`);
        return undefined;
      }

      // Find where the user that heartbeated is in the array and update their last seen
      if (el.username == username) {
        // console.log(`${"Heartbeat:".bgRed.white} Updating: ${el.username}`);
        return ({username: el.username, lastSeen: new Date().getTime() });
      }

      // And return the rest untouched
      return el
    }).filter(user => user !== undefined);
  }

  // console.log(`${"Heartbeat:".bgRed.white} ${onlineUsers.length} Users`);
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
      isPlayingGame: false,
      isWatchingAnime: false,
      isOnline: true,
      isDND: false,
    },
    isDeveloper: false,
    isBetaTester: false,
    pfp: "http://taku.moe:8880/pfp/_default.png",
    banner: "http://taku.moe:8880/banner/_default.png",
    description: "Hi I love anime owo!",
    anime_list: [],
    socials: [],
    connections: [],
  };
  this.following = [];
  this.friend_list = {
    friends: [],
    incoming: [],
    outgoing: [],
  };
  this.settings = {
    show_nsfw: false,
    language: "english",
    account: {
        email: email,
        password: password,
    },
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
    },
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
  this.from = from;
  this.created_at = new Date().getTime();
  this.read = false;
  if (content) this.content = content;
  if (post_uuid) this.post_uuid = post_uuid;
  if (channel_uuid) this.channel_uuid = channel_uuid;
}

// Friend Requests 
function acceptFriendRequest(me, userToAccept){
  return new Promise(async (resolve, reject) => {
    // Add the other users uuid to my pending list
    await users.update(
      { uuid: me },
      { $pull: { 'friend_list.incoming': userToAccept } },
    );

    // Add the other user to my friends
    await users.update(
      { uuid: me },
      { $addToSet: { 'friend_list.friends': userToAccept} }
    );

    // Add my uuid to the other users pending list
    await users.update(
      { uuid: userToAccept },
      { $pull: { 'friend_list.outgoing': me} },
    );

    // Add me to their friends
    await users.update(
      { uuid: userToAccept },
      { $addToSet: { 'friend_list.friends': me} }
    );

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

    console.log(user.uuid);

    if (error) {
      console.log(error);
      res.status(403);
      res.json({
        message: "You must be logged in to view your user info idiot 🖕🖕🖕",
      });
      return;
    }

    // Get user's data from db
    req.user = (await users.find({uuid: user.uuid }, { collation: { locale: "en", strength: 2 } }))[0];
    next();
  });
};


let notificationRoom = '';

// Websockets
io.on("connection", socket => {
  socket.emit("message", "Connected to taku DMs");
  socket.emit("messages", currentMessages);
  
  totalConnections++;

  console.log(`Total Connections: ${totalConnections}`);
  
  socket.on("ping", () => {
    socket.emit("pong", {cpu: currentLoad, ram: ramUsage });
  });

  // Connect the user to their own unique room for notifications
  socket.on("room", room => {
    console.log("New room".red, room);
    socket.join(room);
  });

  // Messages

  app.post("/friend/add", authJWT, async (req, res) => { // Add a friend
    let me = req.user
    let userToAdd = req.body.uuid
    
    if (me.friend_list.incoming.includes(userToAdd)) {
      await acceptFriendRequest(me.uuid, userToAdd);
      res.status(200);
      res.json({"message": "Friend Request Accepted"});
      return
    };
  
    // Add the other users uuid to my pending list
    await users.update(
      { uuid: me.uuid },
      { $addToSet: { 'friend_list.outgoing': userToAdd } }
    );
  
    // Send notification to other user
  
    let notification = new Notification("Friend Request", me.uuid, `${me.username} has sent you a friend request!`);
  
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
  let me = req.user.uuid;
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

      // Empty array where ill add the links for the attachments for below
      let attachments = [];
  
      // Save attachment blobs locally and create a link for them to see
      for (attachment of req.files){
        attachment.originalname = `${new Date().getTime().toString()}-${attachment.originalname.replace(/\s/g, "_")}`; // Remove spaces with underscores
  
        attachment.html = `http://taku.moe:8880/uploads/${attachment.originalname}`;
        attachment.originalurl = `http://taku.moe:8880/uploads/${attachment.originalname}`;

        if (attachment.mimetype.startsWith("image/jpeg") || attachment.mimetype.startsWith("image/png")) {
          await cacheImage(attachment);
          attachment.html = `http://taku.moe:8880/uploads/cache/${attachment.originalname}`;
        }

        // Rename the file back to the original name cus multer is stupid
        fs.renameSync(`./db/uploads/${attachment.filename}`, `./db/uploads/${attachment.originalname}`);
        
        attachments.push(attachment);
      };

      // let attachments = cacheImages(req.files);

  
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
      addToOnlineUsers(user.username);
      // console.log(onlineUsers);
      // console.log(onlineUsers.length.toString().green + " users online");
    });
  });
  socket.on("disconnect", () => {
    totalConnections--;
    console.log(`WS Connections: ${totalConnections}`);
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
  const username = req.params.username;
  const response = await users.find(
    { username: username },
    { collation: { locale: "en", strength: 2 } }
  );

  // Add the osu connections
  if (response[0] && response[0].profile && response[0].profile.connections && response[0].profile.connections.osu) {
    response[0].profile.connections = {
      osu: (await axios.get(`https://osu.ppy.sh/api/get_user?u=${response[0].profile.connections.osu.user_id}&k=${osuKey}`)).data[0]
    }
  }

  // Get their status
  if (response[0]) {
    if (onlineUsers.some(user => user.username == username)) {
      response[0].online = true
    }
    else {
      response[0].online = false
    }
  }

  res.status(200);
  res.json(response);
});

app.get("/user", authJWT, async (req, res) => {
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
app.post("/user/anime", async (req, res) => {
  // Parse body
  const body = req.body;

  // Verify Logged In User
  jwt.verify(body.user, "h4x0r", async (error, user) => {
    if (error) {
      console.log(error);
    }
    req.user = user;

    let test = await users.update(
      { username: req.user.username },
      { $pull: { "profile.anime" : parseInt(body.anime) } }
    );
    
    console.log(test);

    res.status(200);
    res.json({ message: "done" });
  });
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

  let link = `http://taku.moe:8880/uploads/${file.originalname}`;

  if (file.mimetype.startsWith("image/jpeg") || file.mimetype.startsWith("image/png")) {
    await cacheImage(file);
    link = `http://taku.moe:8880/uploads/cache/${file.originalname}`;
  }

  // Rename the file back to the original name cus multer is stupid
  fs.renameSync(`./db/uploads/${file.filename}`, `./db/uploads/${file.originalname}`);

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
// app.get("/banner/:id", async (req, res) => {
//   const id = req.params.id;
//   const response = await backgrounds.find({ id: parseInt(id) });
//   res.status(200);
//   res.json(response[0].url);
// });

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

async function getAnimeList(){
  let animeList = await axios.get('https://notify.moe/api/animelist/4J6qpK1ve');
  animeList = animeList.data.items

  for (i in animeList) {
    let animeItem = await axios.get(`https://notify.moe/api/anime/${animeList[i].animeId}`);
    animeItem = animeItem.data;
    
    
    // animeItem = {
    //   title: {
    //     english: animeItem.title.english,
    //     romaji: animeItem.title.romaji
    //   },
    //   description: animeItem.summary,
    //   year: parseInt(animeItem.startDate.split("-")[0]),
    //   tags: animeItem.genres,
    //   nsfw: false,
    //   submitted_by: "Geoxor",
    //   id: parseInt(i) + 11,
    // }

    const httpForImage = require('https'); // or 'https' for https:// URLs
    const file = fs.createWriteStream(`./db/anime/posters/${parseInt(i) + 11}.jpg`);

    console.log(`Fetching anime https://media.notify.moe/images/anime/original/${animeItem.id}${animeItem.image.extension}`);
    httpForImage.get(`https://media.notify.moe/images/anime/original/${animeItem.id}${animeItem.image.extension}`, function(response) {
      response.pipe(file);
    });
    
    console.log(animeItem.image);
  }
}


// getAnimeList();
const port = process.env.PORT || 8880;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
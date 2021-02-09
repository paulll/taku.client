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
const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const linkifyHtml = require('linkifyjs/html');
const axios = require('axios');

// const options = {
//     key: fs.readFileSync("./key.pem"),
//     cert: fs.readFileSync("./cert.pem")
// };

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+$]{3,30}")).required(),

  repeat_password: Joi.ref("password"),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

// Database
var monk = require("monk");
const { format } = require("path");
const { log } = require("console");
const url = "localhost:27017/animebackgrounds";
const db = monk(url);
db.then(() => {
  console.log(`Connected to database ${url}`);
});

// Database Collections
let users = db.get("users");
let backgrounds = db.get("backgrounds");
let messages = db.get("messages");
let dms = db.get("dms");
let anime = db.get("anime");

// API
var app = express();
var http = require("http").createServer(app);

var io = require("socket.io")(http, {
  cors: { origin: "*" },
});

app.use(
  cors({
    origin: "http://anihuu.moe:8080",
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
  user = user[0];

  const dbUser = await users.find(
    { username: user.username },
    { collation: { locale: "en", strength: 2 } }
  );

  const payload = {
    _id: user._id,
    username: user.username,
  };

  jwt.sign(payload, "h4x0r", { expiresIn: "30d" }, (err, token) => {
    console.log(token);
    res.cookie("token", token);
    res.json({
      message: "Logged in",
      token: token,
      username: user.username,
      user: dbUser
    });
    res.status(200);
  });
}

// I should probably move this function in the front end instead because
// I don't like having the html tags in the JSONs on the server
// Or at least have it run last before sending the the message to the user
// So it only sends them the HTML but the database keeps the original links intact
function renderHtml(url){
  if (url.match(/(\.png)|(\.jpg)|(\.jpeg)|(\.gif)|(\.webp)/ig)) {
    return `<img src=${url} alt="">`;
  } 
  else if (url.match(/(\.mp4)|(\.webm)|(\.mov)/ig)){
    return `<video controls> <source src=${url}> </video>`;
  }
  else if (url.match(/(\.mp3)|(\.ogg)|(\.wav)|(\.flac)|(\.aac)/ig)){
    return `<audio controls> <source src=${url}> </audio>`;
  }
  else {
    // if its not an image then its probably a normal link therefore
    // ill make it clickable
    return linkifyHtml(url, {defaultProtocol: 'https'});
  }
}

const currentMessages = [];

// Websockets
io.on("connection", socket => {
  socket.emit("message", "Connected to anihuu DMs");
  socket.emit("messages", currentMessages);

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
          { username: user.username },
          { collation: { locale: "en", strength: 2 } }
        )
      )[0];
  
      if (!author) return

      // Empty array where ill add the links for the attachments for below
      let attachments = [];
  
      // Save attachment blobs locally and create a link for them to see
      req.files.forEach(attachment => {
        attachment.originalname = `${new Date().getTime().toString()}-${attachment.originalname.replace(/\s/g, "_")}`; // Remove spaces with underscores
  
        // Rename the file back to the original name cus multer is stupid
        fs.renameSync(`./db/uploads/${attachment.filename}`, `./db/uploads/${attachment.originalname}`);
        attachment.html = renderHtml(`http://anihuu.moe:8880/uploads/${attachment.originalname}`);
        attachments.push(attachment);
      });
  
      // Construct message object
      const message = {
        content: messageEvent.content,
        attachments: attachments,
        date: new Date().getTime(),
        author: {
          username: author.username,
          flare: author.settings.appearance.flare,
          pfp: author.pfp,
        },
      };
  
      message["content"] = renderHtml(message.content);
  
      currentMessages.push(message);
      if (currentMessages.length > 20) currentMessages.shift();
  
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
        username: user.username,
        pfp: user.pfp
      };

      // Besides the client who is typing
      socket.broadcast.emit("typingUser", typingUser);
    });
  });
  socket.on("disconnect", () => {

  });
});

// Routes
app.get("/", (req, res) => {
  res.status(200);
  res.send(
    JSON.stringify({
      message: "hello",
    })
  );
});

// User Endpoints
app.get("/user/:username", async (req, res) => {
  const username = req.params.username;
  const response = await users.find(
    { username: username },
    { collation: { locale: "en", strength: 2 } }
  );

  res.status(200);
  res.json(response);
});
app.get("/user", async (req, res) => {
  // Verify Logged In User
  jwt.verify(req.cookies.token, "h4x0r", async (error, user) => {
    if (error) {
      res.status(401);
      res.json({
        message: "You must be logged in to view your user info",
      });
      return;
    }
    req.user = user;

    const response = await users.find(
      { username: user.username },
      { collation: { locale: "en", strength: 2 } }
    );

    delete response[0].password;

    res.status(200);
    res.json(response[0]);
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

    await users.update(
      { username: req.user.username },
      { $addToSet: { anime_showcase: { $each: [...body.anime] } } }
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

    await users.update(
      { username: req.user.username },
      { $pull: { anime_showcase: parseInt(body.anime) } }
    );

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
      { $set: { socials: body.socials } }
    );

    res.status(200);
    res.json({ message: "done" });
  });
});

// Setting Routes
app.post("/settings", async (req, res) => {
  // Verify Logged In User
  jwt.verify(req.cookies.token, "h4x0r", async (error, user) => {
    if (error) {
      res.status(401);
      res.json({
        message: "You must be logged in to view your user info",
      });
      return;
    }
    req.user = user;

    console.log(req.body.settings);

    await users.update(
      { username: user.username },
      { $set: { settings: req.body.settings } }
    );

    res.status(200);
    res.json({"message": "Changes saved successfully"});
  });
});
app.post("/settings/upload", upload.any(), async (req, res) => {
  // Verify Logged In User
  jwt.verify(req.cookies.token, "h4x0r", async (error, user) => {
    if (error) {
      res.status(401);
      res.json({
        message: "You must be logged in to view your user info",
      });
      return;
    }
    req.user = user;

    let file = req.files[0];
    file.originalname = file.originalname.replace(/\s/g, "_");

    // Rename the file back to the original name cus multer is stupid
    fs.renameSync(`./db/uploads/${file.filename}`, `./db/uploads/${file.originalname}`);

    res.status(200);
    res.json({"message": "File uploaded successfully", "link": `http://anihuu.moe:8880/uploads/${file.originalname}`});
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
app.get("/banner/:id", async (req, res) => {
  const id = req.params.id;
  const response = await backgrounds.find({ id: parseInt(id) });
  res.status(200);
  res.json(response[0].url);
});

// Auth
app.post("/signup", async (req, res) => {
    // Parse body
    const body = req.body;

    // Validate the form
    try {
        var result = await schema.validateAsync(body);
    } catch (error) {
        console.log(error);
        res.status(400);
        res.json(error);
    }

    // Check if someone else has the same username
    if ((await users.find({ username: result.username }, { collation: { locale: "en", strength: 2 } })).length == 1) {
        res.status(200);
        res.json({ error: "Username already taken" });
        return;
    }

    // Check if the email is already bound to an account
    if ((await users.find({ email: result.email })).length == 1) {
        res.status(200);
        res.json({ error: "Email already exists" });
        return;
    }

    // Encrypt Passwords
    const hash = await bcrypt.hash(body.password, saltRounds);

    // Replace plain password with hashed password for database
    result.password = hash;

    // Append defaults to user
    result.total_likes = 0;
    result.total_comments = 0;
    result.total_tomodachi = 0;
    result.total_uploads = 0;

    result.likes = {};
    result.comments = {};
    result.tomodachi = {};
    result.uploads = {};
    result.socials = {};

    result.anime_showcase = [];
    result.background_showcase = {};
    result.description = "I love anime owo!";
    result.pfp = `http://anihuu.moe:8880/pfp/_default.png`;
    result.uploaded_backgrounds = {};
    result.vip = false;
    result.banner = 0;
    result.state = true;
    result.dms = {},
    result.settings = {
        appearance: {
            darkmode: false,
            animate_pfps: true,
            typing_sfx: {
                enabled: true,
                url: ""
            },
            mention_sfx: {
                enabled: true,
                url: ""
            },
            theme_color: "#ff006b",
            flare: {
              enabled: false,
              color: '#ff006b',
              content: "",
            }
        },
        nsfw_referrals: true,
        language: "english",
        billing: {
            active: false,
            active_subscription: [],
            transaction_history: [],
            payment_methods: [],
        },
        notifications: {
            pause_all: false,
            chat: true,
            posts: true,
            comments: true,
            friend_requests: true,
            emails: true,
        },
        privacy: {
            show_activity: true,
            blocked_users: [],
        },
    }

    // Add to database
    await users.insert(result);

    // Send email auth token

    // Respond to user
    res.status(200);
    res.json(result);
});
app.post("/login", async (req, res) => {
  // Parse body
  const body = req.body;
  checkUser(body.username, body.password);

  async function checkUser(username, password) {
    const user = await users.find(
      { username: username },
      { collation: { locale: "en", strength: 2 } }
    );

    // Try matching
    try {
      const match = await bcrypt.compare(password, user[0].password);
      if (match) {
        createToken(user, res);
      }
      // If password doesn't match throw error
      else throw "error";
    } catch (error) {
      if (error) {
        res.status(200);
        res.json({ error: "Invalid Credentials ｡･ﾟﾟ*(>д<)*ﾟﾟ･｡" });
      }
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
    const image = httpForImage.get(`https://media.notify.moe/images/anime/original/${animeItem.id}${animeItem.image.extension}`, function(response) {
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

const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
var cors = require("cors");
const { date } = require("joi");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer({ dest: "./uploads/" });
var http = require("http");
var Jimp = require("jimp");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// const options = {
//     key: fs.readFileSync("./key.pem"),
//     cert: fs.readFileSync("./cert.pem")
// };

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  repeat_password: Joi.ref("password"),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

// Database
var monk = require("monk");
const { format } = require("path");
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
    origin: "http://localhost:8080",
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

  const payload = {
    _id: user._id,
    username: user.username,
  };

  jwt.sign(payload, "h4x0r", { expiresIn: "1d" }, (err, token) => {
    console.log(token);
    res.cookie("token", token);
    res.json({
      message: "Logged in",
      token: token,
      username: user.username,
    });
    res.status(200);
  });
}

const currentMessages = [];

// Websockets
io.on("connection", (socket) => {
  socket.emit("message", "Connected to anihuu DMs");
  socket.emit("messages", currentMessages);

  socket.on("message", (messageEvent) => {
    if (!messageEvent.user) return;

    author = {};

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

      if (messageEvent.content.length == 0) return;

      const message = {
        content: messageEvent.content,
        date: new Date().getTime(),
        author: {
          username: author.username,
          pfp: author.pfp,
        },
      };

      if (currentMessages.length > 35) currentMessages.shift();

      currentMessages.push(message);

      // Send to all other users
      socket.broadcast.emit("messages", currentMessages);

      // Send to current user
      socket.emit("messages", currentMessages);
    });
  });

  socket.on("disconnect", () => {});
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
  console.log(body);

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
app.patch("/user/anime", async (req, res) => {
  // Parse body
  const body = req.body;
  console.log(body);
  console.log("ass");

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
  console.log(body);

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

app.get("/banner/:id", async (req, res) => {
  const id = req.params.id;
  const response = await backgrounds.find({ id: parseInt(id) });
  res.status(200);
  res.json(response[0].url);
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
    const animelist = await anime.find({ title: new RegExp(keywords, "i") });
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
    var result = await schema.validateAsync(body);
  } catch (error) {
    res.status(400);
    res.json(error);
  }

  // Check if someone else has the same username
  if (
    (
      await users.find(
        { username: result.username },
        { collation: { locale: "en", strength: 2 } }
      )
    ).length == 1
  ) {
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
  result.role = "";
  result.total_tomodachi = 0;
  result.tomodachi = [];
  result.anime_showcase = [];
  result.background_showcase = {};
  result.likes = {};
  result.socials = {};
  result.pfp = `http://localhost:8880/pfp/_default.png`;
  result.total_uploads = 0;
  result.uploaded_backgrounds = {};
  result.vip = false;
  result.banner = 0;
  result.state = true;
  (result.dms = {}),
    (result.settings = {
      theme: "light",
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
    });

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

const port = process.env.PORT || 8880;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

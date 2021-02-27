const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { date } = require("joi");
const bodyParser = require("body-parser");
var http = require("http");
const si = require("systeminformation");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const colors = require('colors');

// const options = {
//     key: fs.readFileSync("./key.pem"),
//     cert: fs.readFileSync("./cert.pem")
// };

const auth = require("./middlewares/auth.js");       // Import auth system
const db = require("./handlers/database.js");        // Import database handler

// API
var app = express();
var http = require("http").createServer(app);

var io = require("socket.io")(http, {
    cors: { origin: "*" },
});

module.exports = io;

app.use(cors({
    origin: "http://taku.moe:8080",
    credentials: true,
}));

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("db"));
app.use(express.static("uploads"));
app.use(cookieParser());

// Auth
app.use(require("./auth/signup.js"));                              // Import signup
app.use(require("./auth/login.js"));                               // Import login
        
// Routes               
app.use('/search',        require("./routes/search.js"));          // Import search
app.use('/anime',         require("./routes/anime.js"));           // Import anime
app.use('/settings',      require("./routes/settings.js"));        // Import settings
app.use('/user',          require("./routes/user.js"));            // Import user
app.use('/friend',        require("./routes/friend.js"));          // Import friend
app.use('/message',       require("./routes/message.js"));         // Import message
app.use('/channels',      require("./routes/channels.js"));        // Import channels
app.use('/notifications', require("./routes/notifications.js"));   // Import notifications
app.use('/connections',   require("./routes/connections.js"));     // Import connections

// Online users
let onlineUsers = [];

// This only runs when some user sends a heartbeat, it updates everyone as long as there is at least 1 user online
async function addToOnlineUsers(uuid) {

    // Update user last seen in their db
    let newLastSeen = new Date().getTime();
    await db.users.update({ 'uuid': uuid }, { "$set": { 'profile.status.lastSeen': newLastSeen } });

    // Check if the user is already in there
    const found = onlineUsers.some(user => user.uuid == uuid);

    // If they aren't, add them
    if (!found) onlineUsers.push({ uuid: uuid, lastSeen: newLastSeen })

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
                return ({ uuid: user.uuid, lastSeen: newLastSeen });
            }

            // And return the rest untouched
            return user
        }).filter(user => user !== undefined);
    }

    return onlineUsers;
}

const currentMessages = [];

let totalConnections = 0;
let currentLoad = 0;
let ramUsage = 0;

setInterval(async () => {
    currentLoad = parseInt((await si.currentLoad()).currentLoad.toFixed(0));
    ramUsage = Math.floor(process.memoryUsage().heapUsed / 1000);
}, 1000);

let notificationRoom = '';

// Websockets
io.on("connection", socket => {
    // console.log(`Total Connections: ${totalConnections}`);
    socket.on("ping", () => {
        socket.emit("pong", { cpu: currentLoad, ram: ramUsage });
    });
    // Connect the user to their own unique room for notifications
    socket.on("room", uuid => {
        // console.log("[Notification WS] Joined".red, uuid.red);
        socket.join(uuid);
    });

    socket.on('join_channel', async channel_uuid => {
        console.log("[Channel WS]".bgRed.black, "Joined", channel_uuid.red);
        socket.join(channel_uuid);
    });

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
    socket.on("heartbeat", heartbeat => {
        // console.log(heartbeat);
        jwt.verify(heartbeat.user, "h4x0r", async (error, user) => {
            if (!user || user === undefined) return;

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

// Routes
app.get("/", (req, res) => {
    res.status(200).json({message: "hello"});
});

app.get("/blockedUsers", auth, async (req, res) => {
    res.status(200).json(req.user.settings.privacy.blocked_users);
});

app.get("/dm/:channel_uuid", auth, async (req, res) => {
    const dm = (await db.channels.find({ uuid: req.params.channel_uuid }))[0];
    if (!dm.memberList.includes(req.user.uuid)) {
        res.status(403).json({ "message": 'Forbidden' });
        return;
    }
    res.status(200).json({ "dm": dm });
});

const port = process.env.PORT || 8880;
http.listen(port, () => {
    console.log(`listening on *:${port}`);
}); 
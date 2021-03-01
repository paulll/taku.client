const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
var http = require("http");
const si = require("systeminformation");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const handleHeartbeat = require('./handlers/onlineUserHandler');
const port = process.env.PORT || 8880;

// const options = {
//     key: fs.readFileSync("./key.pem"),
//     cert: fs.readFileSync("./cert.pem")
// };

const auth = require("./middlewares/auth.js");       // Import auth system
const db = require("./handlers/database.js");        // Import database handler

// API
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http, {cors: { origin: "*" }});

// Export io for other files 
module.exports = io;

// Middlewares
app.use(cors({
    origin: "http://taku.moe:8080", 
    credentials: true 
}));
app.use(morgan("dev"));                                         // Enable HTTP code logs
app.use(bodyParser.json());                                     // auto parse req.bodies as json
app.use(express.static("db"));                                  // Enable the db folder to be accessible from the url
app.use(cookieParser());                                        // Use cookie parser so we can access cookies from reqs

// Auth
app.use(require("./auth/signup"));                              // Import signup auth
app.use(require("./auth/login"));                               // Import login auth
        
// Routes               
app.use('/search',        require("./routes/search"));          // Import search
app.use('/anime',         require("./routes/anime"));           // Import anime
app.use('/settings',      require("./routes/settings"));        // Import settings
app.use('/user',          require("./routes/user"));            // Import user
app.use('/friend',        require("./routes/friend"));          // Import friend
app.use('/message',       require("./routes/message"));         // Import message
app.use('/channels',      require("./routes/channels"));        // Import channels
app.use('/notifications', require("./routes/notifications"));   // Import notifications
app.use('/connections',   require("./routes/connections"));     // Import connections

// Websockets
io.on("connection", socket => {
    socket.on("ping", () => socket.emit("pong", { cpu: currentLoad, ram: ramUsage }));
    socket.on("room", uuid => socket.join(uuid));
    socket.on("heartbeat", heartbeat => handleHeartbeat(heartbeat));
    socket.on('leave_channel', async channel_uuid => {
        console.log("[Channel WS]".bgRed.black, "Left", channel_uuid.red);
        socket.leave(channel_uuid);
    });
    socket.on('join_channel', async channel_uuid => {
        if(channel_uuid.length < 1) return;
        console.log("[Channel WS]".bgRed.black, "Joined", channel_uuid.red);
        socket.join(channel_uuid);
    });
});

let currentLoad = 0;
let ramUsage = 0;

setInterval(async () => {
    currentLoad = parseInt((await si.currentLoad()).currentLoad.toFixed(0));
    ramUsage = Math.floor(process.memoryUsage().heapUsed / 1000);
}, 1000);

// const routes = fs.readdirSync('./routes').map(route => route.replace(".js", ""));
// for (route of routes) app.use(`/${route}`, require(`./routes/${route}`));  // Import all routes

app.get("/", (req, res) => res.status(200).json({message: "hello"})); 

http.listen(port, () => console.log(`listening on *:${port}`)); 
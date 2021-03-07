const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const si = require("systeminformation");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const colors = require('colors');
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const handleHeartbeat = require('./handlers/onlineUserHandler');
const port = process.env.PORT || 2087;
const version = 'v0.102';
const logo = `  ___       ___       ___       ___   
 /\\  \\     /\\  \\     /\\__\\     /\\__\\  
 \\:\\  \\   /::\\  \\   /:/ _/_   /:/ _/_ 
 /::\\__\\ /::\\:\\__\\ /::-"\\__\\ /:/_/\\__\\
/:/\\/__/ \\/\\::/  / \\;:;-",-" \\:\\/:/  /
\\:\\__\\     /:/  /   |:|  |    \\::/  / 
 \\/__/     \\/__/     \\|__|     \\/__/  ${version}
`;

console.log(logo.rainbow);
 
const smtp = require('./services/smtp.js');                             // Run SMTP Email server

const options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
};

const auth = require("./middlewares/auth.js");                          // Import auth system
const authSocket = require("./middlewares/authSocket.js");              // Import auth system
const db = require("./handlers/database.js");                           // Import database handler

// API
var app = express();
var https = require("https").createServer(options, app);
var io = require("socket.io")(https, {cors: { origin: "*" }});
io.use(authSocket);

// Export io for other files 
module.exports = io;

// Bloatwares
app.use(cors({origin: "https://taku.moe:2096", credentials: true}));    // Setup cors and allow only https
app.use(morgan("dev"));                                                 // Enable HTTP code logs
app.use(bodyParser.json());                                             // auto parse req.bodies as json
app.use(express.static("db"));                                          // Enable the db folder to be accessible from the url
app.use(cookieParser());                                                // Use cookie parser so we can access cookies from reqs
        
// Auth     
app.use(require("./auth/signup"));                                      // Import signup auth
app.use(require("./auth/login"));                                       // Import login auth
                
// Routes                       
app.use('/search',        require("./routes/search"));                  // Import search
app.use('/anime',         require("./routes/anime"));                   // Import anime
app.use('/settings',      require("./routes/settings"));                // Import settings
app.use('/user',          require("./routes/user"));                    // Import user
app.use('/friend',        require("./routes/friend"));                  // Import friend
app.use('/message',       require("./routes/message"));                 // Import message
app.use('/channels',      require("./routes/channels"));                // Import channels
app.use('/notifications', require("./routes/notifications"));           // Import notifications
app.use('/connections',   require("./routes/connections"));             // Import connections
app.use('/wallpapers',    require("./routes/wallpapers"));              // Import wallpaper


// Websockets
io.on("connection", socket => {
    console.log("[WS]".bgRed.black, "New connection", socket.id.red, "Total", `${io.sockets.sockets.size.toString().red}`);
    socket.on("ping", () => socket.emit("pong", { cpu, ram }));  // Send ping and pongs
    socket.on("user", uuid => socket.join(uuid));                                       // Join a unique room for each user

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
    socket.on('disconnect', () => console.log("[WS]".bgRed.black, "Disconnected", "Total", `${io.sockets.sockets.size.toString().red}`));
    socket.on('join_vc_channel', (channel_uuid, user_uuid) => {
        socket.join(channel_uuid);
        socket.on('disconnect', () => socket.to(channel_uuid).broadcast.emit('user_disconnected', user_uuid));
        socket.to(channel_uuid).broadcast.emit('user_connected', user_uuid)
        console.log("[Calling WS]".bgRed.black, "Broadcasting new user", user_uuid.red);
    });
});


let cpu = 0;
let ram = 0;

setInterval(async () => {
    cpu = parseInt((await si.currentLoad()).currentLoad.toFixed(0));
    ram = Math.floor(process.memoryUsage().heapUsed / 1000);
}, 1000);

// const routes = fs.readdirSync('./routes').map(route => route.replace(".js", ""));
// for (route of routes) app.use(`/${route}`, require(`./routes/${route}`));  // Import all routes

app.get("/", (req, res) => res.status(200).json({message: "hello"})); 

https.listen(port, () => console.log("[INDEX]".bgCyan.black, `Started on port ${port.toString().cyan}`));
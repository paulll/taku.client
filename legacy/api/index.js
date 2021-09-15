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
const taku = require("./handlers/classes.js");    // Import Constructor classes
const version = 'v0.144';
const Jimp = require("jimp");
const logo = `  ___       ___       ___       ___   
 /\\  \\     /\\  \\     /\\__\\     /\\__\\  
 \\:\\  \\   /::\\  \\   /:/ _/_   /:/ _/_ 
 /::\\__\\ /::\\:\\__\\ /::-"\\__\\ /:/_/\\__\\
/:/\\/__/ \\/\\::/  / \\;:;-",-" \\:\\/:/  /
\\:\\__\\     /:/  /   |:|  |    \\::/  / 
 \\/__/     \\/__/     \\|__|     \\/__/  ${version}
`; 
console.log(logo.rainbow);

process.env.DEV_MODE = true;                                            // Used to disable HTTPS and other things that can cause problems when running server locally
                                         
if(process.env.DEV_MODE == 'true') {
    console.warn('DEVELOPMENT MODE IS ENABLED!');
    process.env.rootPath = 'localhost:2087'
} else {
    process.env.rootPath = 'http://localhost:2087'
}
 
// const smtp = require('./services/smtp.js');                             // Run SMTP Email server
const options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
};
const auth = require("./middlewares/auth.js");                          // Import auth system
const authSocket = require("./middlewares/authSocket.js");              // Import auth system
const db = require("./handlers/database.js");                           // Import database handler
const { debug } = require("console");

// API
var app = express(); 

// Run server either http or https
if(process.env.DEV_MODE == 'true') {
    var https = require("http").createServer(app);
} else {
    var https = require("https").createServer(options, app);
}

var io = require("socket.io")(https, {cors: { origin: "*" }});
io.use(authSocket);

// Initialize directories
require('./services/initDirectories.js').initDirectories();

// Export io for other files 
module.exports = io; 

// Bloatwares
if(process.env.DEV_MODE == 'true') {
    app.use(cors({ origin: "http://localhost", credentials: true }));                 // Setup cors and allow http and set origin to localhost
} else {
    app.use(cors({origin: "http://localhost", credentials: true}));     // Setup cors and allow only https
}

function format24h() {
    var date = new Date(); 
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    seconds = seconds < 10 ? '0'+seconds : seconds;
    var strTime = `[${hours}:${minutes}:${seconds}${ampm}]`;
    return strTime.bgWhite.black;
}

// Custom console formatting
console.ws = (...messages) => console.log(`${format24h()}`.bgCyan.white + "[WS]".bgRed.black, messages.join(" ")); 

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
app.use('/wallpapers',    require("./routes/wallpapers"));              // Import wallpapers
app.use('/tags',          require("./routes/tags"));                    // Import tags

// Websockets
io.on("connection", socket => {
    console.ws("New connection", socket.id.red, "Total", `${io.sockets.sockets.size.toString().red}`);

    socket.on("ping", () => socket.emit("pong", { cpu, ram }));  // Send ping and pongs
    socket.on("heartbeat", heartbeat => handleHeartbeat(heartbeat));

    socket.on("user", uuid => {
        console.ws("Joined user", uuid.red);
        socket.join(uuid);
    });
    socket.on("room", uuid => {
        console.ws("Joined room", uuid.red);
        socket.join(uuid);
    });
    socket.on('join_channel', async channel_uuid => {
        if(channel_uuid.length < 1) return;
        console.ws("Joined", channel_uuid.red);
        socket.join(channel_uuid);
    });             
    socket.on('leave_channel', async channel_uuid => {
        console.ws("Left", channel_uuid.red);
        socket.leave(channel_uuid);
    });
    socket.on('disconnect', () => console.ws("Disconnected", "Total", `${io.sockets.sockets.size.toString().red}`));
    socket.on('join_vc_channel', (channel_uuid, user_uuid) => {
        socket.join(channel_uuid);
        socket.on('disconnect', () => socket.to(channel_uuid).broadcast.emit('user_disconnected', user_uuid));
        socket.to(channel_uuid).broadcast.emit('user_connected', user_uuid)
        console.ws("Broadcasting new user", user_uuid.red);
    });
    socket.on('message', async messageEvent => { 
        
        // Load the channel from the database
        let channel = (await db.channels.find({ 'uuid': messageEvent.channel.uuid }))[0];
    
        // Check if the user is a member of that channel
        if (!channel.member_list.includes(messageEvent.author.uuid)) return res.status(401).json({ "message": "Forbidden" });

        // Replace message with taku message new message
        let message = new taku.Message(messageEvent.author.uuid, messageEvent.content, messageEvent.channel.uuid);

        await db.messages.insert(message); // Add to message database
        await db.channels.update({ 'uuid': message.channel_uuid }, { "$set": { 'last_message': message.uuid } }); // Add to message to the channel it belongs to
    
        message = (await db.messages.aggregate([
            {'$match': {"uuid": message.uuid}},
            {'$lookup': {'from': 'users','localField': 'author','foreignField': 'uuid','as': 'author'}},
            {'$unwind': {'path': '$author','preserveNullAndEmptyArrays': true}},
            {'$project': { '_id': 0, 'author.settings': 0, 'author.profile': 0, 'author.created_at': 0, 'author.friend_list': 0, 'author.following': 0, 'author._id': 0 } }
        ]))[0];
    
        // socket.broadcast.emit("message", message);  // Send to all other users
        // socket.emit("message", message);            // Send to current user
    
        // Create the notification
        let notification = new taku.Notification("Message", { uuid: messageEvent.author.uuid, username: messageEvent.author.username }, message.content);
        io.sockets.in(message.author.uuid).emit('message', message);
    
        for (member of channel.member_list) {
            if (member != message.author.uuid) {
                // Send event to the specific users
                await db.notifications.update(
                    { owner_uuid: member },
                    { $push: { 'list': notification } }
                );
                
                io.sockets.in(member).emit('notification', notification);
                io.sockets.in(member).emit('message', message);
            }
        }
    });
    socket.on('typing', event => {
        console.ws(event.user.username.red, "typing", event.user.uuid.red);
        socket.broadcast.emit('typing', event);
    });
});

let cpu = 0;
let ram = 0;

setInterval(async () => {
    cpu = parseInt((await si.currentLoad()).currentLoad.toFixed(0));
    ram = Math.floor(process.memoryUsage().heapUsed / 1000);
}, 1000);

app.get("/", (req, res) => res.status(200).json({message: "hello"})); 
https.listen(port, () => console.log("[INDEX]".bgCyan.black, `Started on port ${port.toString().cyan}`));
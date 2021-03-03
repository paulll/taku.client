const jwt = require("jsonwebtoken");

const verifiedUsers = [];

// Middleware to auth users before allowing them to connect using websockets
function authSocket(socket, next) {
    if (!socket.handshake.auth.token) return next(new Error("who are you 🖕🖕🖕"));

    if (verifiedUsers.includes(socket.handshake.auth.token)) return next();
    jwt.verify(socket.handshake.auth.token, "h4x0r", async (error, user) => {
        if (error) next(new Error("You must be logged in to connect to a websocket idiot 🖕🖕🖕"));
        verifiedUsers.push(socket.handshake.auth.token)
        next();
    });
}

module.exports = authSocket
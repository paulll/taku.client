// This only runs when some user sends a heartbeat, it updates everyone as long as there is at least 1 user online
// Online users
const db = require("../handlers/database.js");       // Import database handler
const jwt = require("jsonwebtoken");
let onlineUsers = [];

function handleHeartbeat(heartbeat) {
    jwt.verify(heartbeat.user, "h4x0r", async (error, user) => {
        if (!user || user === undefined) return;
        addToOnlineUsers(user.uuid);
    });
};

async function addToOnlineUsers(uuid) {
    let newLastSeen = new Date().getTime();                                                             
    await db.users.update({ 'uuid': uuid }, { "$set": { 'profile.status.lastSeen': newLastSeen } });    // Update user last seen in their db
    const found = onlineUsers.some(user => user.uuid == uuid);                                          // Check if the user is already in there
    if (!found) onlineUsers.push({ uuid: uuid, lastSeen: newLastSeen });                                // If they aren't, add them
    else { // Otherwise if they are found, update their lastSeen
        onlineUsers = onlineUsers.map(user => {
            if (user.lastSeen + 120000 < newLastSeen) return undefined;                 // Remove old users that havent been seen for more than 60 sec
            if (user.uuid == uuid) return ({ uuid: user.uuid, lastSeen: newLastSeen }); // Find where the user that heartbeated is in the array and update their last seen
            return user // And return the rest untouched
        }).filter(user => user !== undefined);
    }
    return onlineUsers;  
}

module.exports = handleHeartbeat;
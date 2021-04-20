var monk = require("monk");
const url = "mongodb+srv://backend:2IOE2UHdM099cAoE@cluster0.2b5yb.mongodb.net/taku?retryWrites=true&w=majority";
const db = monk(url);
const colors = require("colors");

db.then(() => console.log(`[DATABASE]`.bgBlue.black + ` Connected to MangoliaDB`));

module.exports = {
    users:         db.get("users"),
    messages:      db.get("messages"),
    anime:         db.get("anime"),
    notifications: db.get("notifications"),
    channels:      db.get("channels"), 
    invites:       db.get("invites"),
    wallpapers:    db.get("wallpapers"),
};
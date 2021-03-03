// Database
var monk = require("monk");
const url = "localhost:27017/anihuu";
const db = monk(url);
const colors = require("colors");

db.then(() => {
  console.log(`[DATABASE]`.bgBlue.black + ` Connected to MangoliaDB`);
});

module.exports = {
    users: db.get("users"),
    messages: db.get("messages"),
    anime: db.get("anime"),
    notifications: db.get("notifications"),
    channels: db.get("channels"),
    invites: db.get("invites"),
}
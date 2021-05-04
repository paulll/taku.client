var monk = require("monk");
const url = "localhost/taku";
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

// Gets all the users UUIDs from the database
// module.exports.users.find().then(users => {
//     console.log(users.map(user => user.uuid));
// });

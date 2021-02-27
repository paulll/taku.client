var monk = require("monk");
const url = "localhost:27017/anihuu";
const db = monk(url);
let users = db.get("users");

const jwt = require("jsonwebtoken");

let auth = (req, res, next) => {
    jwt.verify(req.cookies.token, "h4x0r", async (error, user) => {
        if (error) {
            res.status(403);
            res.json({
                message: "You must be logged in to view your user info idiot 🖕🖕🖕",
            });
            return;
        }

        // Get user's data from db
        req.user = (await users.aggregate([
            {
                '$match': {
                    'uuid': `${user.uuid}`
                }
            }, {
                '$lookup': {
                    'from': 'notifications',
                    'localField': 'uuid',
                    'foreignField': 'owner_uuid',
                    'as': 'notifications'
                }
            }
        ]))[0];
        next();
    });
};

module.exports = auth;
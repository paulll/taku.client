const db = require("../handlers/database.js"); // Import database handler

const jwt = require("jsonwebtoken");

let auth = (req, res, next) => {
    jwt.verify(req.cookies.token, "h4x0r", async (error, user) => {
        if (error) {
            res.status(401);
            res.json({
                message: "You must be logged in to view your user info idiot 🖕🖕🖕",
            });
            return;
        }

        // Get user's data from db
        req.user = (await db.users.aggregate([
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
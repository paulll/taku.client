const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = express.Router();

// Functions
async function createToken(user, res) {
  user = user[0]

  const payload = {
    uuid: user.uuid,
    username: user.username,
  };

  jwt.sign(payload, "h4x0r", { expiresIn: "30d" }, (err, token) => {
    res.status(200)
       .cookie("token", token)
       .json({
          message: "Logged in",
          token: token,
          uuid: user.uuid,
          user: user
        });
  });
}

login.post("/login", async (req, res) => {
    // Parse body
    const body = req.body;
    const user = await db.users.find(
      { username: body.username },
      { collation: { locale: "en", strength: 2 } }
    );
    
    try {  // Try matching
      const match = await bcrypt.compare(body.password, user[0].settings.account.password);
      if (match) createToken(user, res);
      else throw "error"; // If password doesn't match throw error
    } catch (error) {
      console.log(error);
      if (error) res.status(200).json({ error: "Invalid Credentials ｡･ﾟﾟ*(>д<)*ﾟﾟ･｡" });
    }
});

module.exports = login;
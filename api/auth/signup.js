const express = require('express');
const db = require("../handlers/database.js"); // Import database handler
const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const taku = require("../handlers/classes.js");    // Import Constructor classes

const signup = express.Router();

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+$]{3,30}")).required(),
  repeat_password: Joi.ref("password"),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
});

signup.post("/signup", async (req, res) => {
    // Parse body
    const body = req.body;

    // Validate the form
    try {
        var form = await schema.validateAsync(body);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }

    // Check if someone else has the same username
    if ((await db.users.find({ username: form.username }, { collation: { locale: "en", strength: 2 } })).length == 1) {
        res.status(200).json({ error: "Username already taken" });
        return;
    }

    // Check if the email is already bound to an account
    if ((await db.users.find({ email: form.email })).length == 1) {
        res.status(200).json({ error: "Email already exists" });
        return;
    }

    // Encrypt Passwords
    const hash = await bcrypt.hash(body.password, saltRounds);

    const user = new taku.User(form.username, form.email, hash);
    // console.log(user);

    // Make a new user with the values we got from the signup form and add to database
    await db.users.insert(user);
    await db.notifications.insert({owner_uuid: user.uuid, list: []});

    // Respond to user
    res.status(200).json(user); 
});

module.exports = signup
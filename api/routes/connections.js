const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const auth = require("../middlewares/auth.js");       // Import auth system
const axios = require('axios');
require('dotenv').config();

// OAuth keys, etc
const OSU_KEY = process.env.OSU_KEY;
const OSU_CLIENT_ID = process.env.OSU_CLIENT_ID;

const router = express.Router();

router.use(auth);

router.route('/:platform')
    .post(async (req, res) => {

        const oauthToken = req.body.code;

        const form = {
            grant_type: "authorization_code",
            client_id: OSU_CLIENT_ID,
            client_secret: OSU_KEY,
            redirect_uri: "https://taku.moe:2096/settings/connections",
            code: oauthToken
        };

        try {
            const verifyToken = await axios.post("https://osu.ppy.sh/oauth/token", JSON.stringify(form), {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (verifyToken.status == 200) {
                // Security 🤵🏻🕵️🕵️🕵️
                // Not your token, it's OUR token :stalinApproves:
                await db.users.update({ 'uuid': req.user.uuid }, { '$set': { 'settings.connections.osu.token': verifyToken.data } });

                const user = await axios.get("https://osu.ppy.sh/api/v2/me", {
                        headers: {
                            Authorization: `Bearer ${verifyToken.data.access_token}`
                        }
                    }
                );

                await db.users.update({ 'uuid': req.user.uuid }, { '$set': { 'profile.connections.osu': user.data } });
            }

        } catch (error) console.log(error);
    })
    .delete(async (req, res) => {
        const plaform = req.params.platform;

        await db.users.update({ 'uuid': req.user.uuid }, { '$unset': { 'profile.connections.osu': undefined, 'settings.connections.osu': undefined } });

        try {
            const deleteToken = await axios.delete("https://osu.ppy.sh/api/v2/oauth/tokens/current", {
                    headers: {
                        Authorization: `Bearer ${req.user.settings.connections.osu.token.access_token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            res.status(200);
            res.json({ "message": `Unlinked ${plaform} successfully` });
        } catch (error) if (error) res.status(500).json({ "message": error.response });
    });

module.exports = router
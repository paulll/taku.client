const express = require('express');
const db = require("../handlers/database.js");       // Import database handler
const auth = require("../middlewares/auth.js");       // Import auth system

const router = express.Router();

router.delete("/", auth, async (req, res) => {
  // Remove other persons uuid from your incoming list
  await db.notifications.update(
      { owner_uuid: req.user.uuid },
      { $set: { list: [] } }
  );
  res.status(200).json(req.user);
});

module.exports = router
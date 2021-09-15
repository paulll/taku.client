const { v4: uuidv4 } = require("uuid"); 

function Invite(to, from, channel_uuid) {

    if (!to) return new Error("'to' must be provided for an invite");
    if (!from) return new Error("'from' must be provided for an invite");
    if (!channel_uuid) return new Error("'channel_uuid' must be provided for an invite");

    this.uuid = uuidv4();                       // UUID of the invite
    this.created_at = new Date().getTime();     // Invite creation date
    this.to = to;                               // To who the invitation is sent
    this.from = from;                           // The sender of the invite
    this.channel_uuid = channel_uuid;           // The channel where the invitation leads to
};

module.exports = {
    name: "Invite",
    constructor: Invite
}
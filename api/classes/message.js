const { v4: uuidv4 } = require("uuid"); 

function Message(author, content, channel_uuid, attachments = []) {

    if (!author) return new Error("'author' must be provided for a message");
    if (!channel_uuid) return new Error("'channel_uuid' must be provided for a message");

    this.uuid = uuidv4();                       // UUID of the message
    this.created_at = new Date().getTime();     // Message send date
    this.content = content;                     // The content of the message
    this.attachments = attachments;             // The files of the message
    this.seen = [author];                       // Array of user UUIDs who saw it
    this.channel_uuid = channel_uuid;           // The channel where that message should be in
    this.author = author;                       // The UUID of the user who made the message
};

module.exports = {
    name: "Message",
    constructor: Message
}
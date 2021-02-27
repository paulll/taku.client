const { v4: uuidv4 } = require("uuid"); 


// C O N S T R U C T O R for new CHANNELS 💭💬
function Channel(author, participants, king) {

    if (!author) return new Error("'author' must be provided to create a channel");
    if (participants.length < 1) return new Error("there must be at least 1 other participant than the author to create a channel");

    this.uuid = uuidv4();                         // UUID of the channel
    this.created_at = new Date().getTime();       // Channel creation date
    this.author = author;                         // The UUID of the user who made the channel
    this.memberList = [author, ...participants];  // The UUIDs of you and the person you're messaging to
    this.lastMessage = lastMessage;               // The UUID of the latest message sent in that channel if any
    if (king) this.king = king;                   // The UUID of who currently owns the group // These apply only, if channel is a group
};

module.exports = {
    name: "Channel",
    constructor: Channel
}
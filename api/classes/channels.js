const { v4: uuidv4 } = require("uuid"); 

class Channel {
    constructor(author, participants, last_message) {

        if (!author) return new Error("'author' must be provided to create a channel");
        if (participants.length < 1) return new Error("there must be at least 1 other participant than the author to create a channel");

        this.uuid = uuidv4();                               // UUID of the channel
        this.created_at = new Date().getTime();             // Channel creation date
        this.author = author;                               // The UUID of the user who made the channel
        this.member_list = [author, ...participants];       // The UUIDs of you and the person you're messaging to
        if (last_message) this.last_message = last_message  // The UUID of the latest message sent in that channel if any
        
        this.type = 'dm';                                   // Type of the channel, here it's dm
    };
};


// C O N S T R U C T O R for new CHANNELS 💭💬
class GroupChannel extends Channel {
    constructor(author, participants, last_message, senpai) {

        // Pass the basic properties into superclass constructor
        super(author, participants, last_message);

        this.senpai = senpai;           // Current owner of the group
        this.name = 'New Group';  // Name of the group
        this.pfp = '_default';          // Link to the profile picture of the group
        this.status = 'We are awesome! owo';    // MOTD of the group
        this.admins = [author];         // Current a dmins of the group
        this.type = 'group';            // Type of the channel, here it's group
    };
}

module.exports = [
    {name: "Channel", constructor: Channel},
    {name: "GroupChannel", constructor: GroupChannel},
]
    
const { v4: uuidv4 } = require("uuid"); 

// C O N S T R U C T O R for new NOTIFICATIONS
function Notification(type, from, content, post, channel, n_attachments = 0) {
    // Throw errors if trying to add dumb notifications with missing parameters
    if (!type) return new Error("'type' must be provided for notifications");
    if (!from) return new Error("'from' must be provided for post notifications");

    switch (type) {
        case "Friend Request":
            if (!from) return new Error("'from' must be provided for friend request notifications ");
            break;
        case "Comment":
            if (!post) return new Error("'post_uuid' must be provided for comment notifications");
            break;
        case "Message":
            if (!channel) return new Error("'channel_uuid' must be provided for message notifications");
            break;
        case "Post":
            if (!post) return new Error("'post_uuid' must be provided for post notifications");
            break;
    }

    this.uuid = uuidv4();
    this.type = type;
    this.from = {
        uuid: from.uuid,
        username: from.username,
    };
    if (channel) this.in = `/${channel.type}/${channel.uuid}`; // The channel the notification is coming from
    if (post) this.at = `/${post.type}/${post.uuid}`;       // The post the notification is coming from
    this.created_at = new Date().getTime();
    this.read = false;
    this.show = true;

    const maxLength = 32;

    // Badass notification splitter/attachment detector thingy
    // If theres only attachments
    if (n_attachments != 0 && !content) this.content = `${n_attachments} attachments`;

    // If theres attachments and text
    else if (n_attachments != 0 && content) {
        const supposedMessage = `${n_attachments} attachments, ${content}`;
        if (supposedMessage.length > maxLength) this.content = supposedMessage.split('').slice(0, maxLength).join('') + " . . .";
        else this.content = `${n_attachments} attachments, ${content}`;
    }

    // If theres only text
    else {
        if (content.length > maxLength) this.content = content.split('').slice(0, maxLength).join('') + " . . .";
        else this.content = content;
    }
};

module.exports = {
    name: "Notification",
    constructor: Notification
}
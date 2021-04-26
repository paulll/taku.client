const { v4: uuidv4 } = require("uuid"); 


function User(username, email, password) {
    this.username = username;
    this.uuid = uuidv4();
    this.created_at = new Date().getTime();
    this.profile = {
        status: {
            lastSeen: new Date().getTime(),
        },
        order: ['favorite_anime', 'osu_profile', 'computer_specs', 'description'],
        isDeveloper: false,
        isBetaTester: false,
        pfp: `${process.env.rootPath}/pfp/_default.png`,
        banner: `${process.env.rootPath}/banner/_default.png`,
        description: "Hi I love anime owo!",
        anime_list: [],
        socials: {},
        connections: {},
    };
    this.following = [];
    this.friend_list = {
        friends: [],
        incoming: [],
        outgoing: [],
    };
    this.settings = {
        show_nsfw: false,
        account: {
            email: email,
            password: password,
        },
        language: "en",
        appearance: {
            darkmode: false,
            animate_pfps: true,
            theme_color: "#fe7692",
            flare: {
                enabled: false,
                content: "",
                color: ""
            }
        },
        sounds: {
            typing: {
                enabled: true,
                url: `${process.env.rootPath}/audio/keystroke.wav`
            },
            mention: {
                enabled: true,
                url: `${process.env.rootPath}/audio/mention.wav`
            },
            notification: {
                enabled: true,
                url: `${process.env.rootPath}/audio/notification.wav`
            },
        },
        connections: {},
        notifications: {
            disable_all: false,
            messages: true,
            posts: true,
            comments: true,
            friend_requests: true,
            follows: true,
            emails: true
        },
        privacy: {
            show_status: true,
            blocked_users: []
        },
        pinned_channels: [],
    }
};

module.exports = {
    name: "User",
    constructor: User
}
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
        pfp: "https://taku.moe:2087/pfp/_default.png",
        banner: "https://taku.moe:2087/banner/_default.png",
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
                url: ""
            },
            mention: {
                enabled: true,
                url: ""
            },
            notification: {
                enabled: true,
                url: ""
            },
            hover: {
                enabled: false,
                url: ""
            },
            click: {
                enabled: false,
                url: ""
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
    }
};

module.exports = {
    name: "User",
    constructor: User
}
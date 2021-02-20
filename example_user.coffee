{
    uuid: "98dbe38b-73bf-4820-a2d2-6d9174cb3eed",                        # Unique   # User ID                                
    username: "Geoxor",                                                  # Unique   # Customizable username                  
    created_at: 1613655545,                                                         # Epoch timestamp when their account gets created                                                                                
    profile: {   
        status: {
            isPlayingGame: false,                                                   # Is the user currently playing any games
            isWatchingAnime: false,                                                 # Is the user currently watching anime
            isOnline: true,                                                         # Is the user online
            isDND: true,                                                            # Is the user on do not disturb
        },    
        isDeveloper: true,                                                          # Is the user developer or not
        isBetaTester: true,                                                         # Is/was the user beta tester or not
        pfp: "http://taku.moe:8880/uplo...png",                                     # Customizable profile pic
        banner: "http://taku.moe:8880/uplo....gif",                                 # Customizable profile banner
        description: "Hi I love anime owo!",                                        # Customizable description
        anime_list: [24, 36 ,45 ,85, 12, 643, 46, 11, 748, 924],                    # Array of anime uuids
        computer: {                                                                 # Customizable computer section
            cpu:  "Intel i5 3570k",                                     
            ram:  "24GB DDR3 @1600MHz",
            mobo: "ASUS M5A97 EVO r2.0",
            gpu:  "Gigabyte GeForce 1660s 6GB",
            psu:  "Chinese Bomba 600watt 8€",
            eth:  "1Gbit Realtek PCIe GBE Family Controller",
            case: "Black Computer Case",
            ssd:  "Kingston A400 480GB",
            hdd:  "1TB WD Blue"
        },
        socials: [                                                                  # Addable social links
            { platform: "youtube",      link: "https://youtub...xor" },
            { platform: "discord",      link: "https://discor...xor" },
            { platform: "twitter",      link: "https://twitte...xor" },
            { platform: "twitch",       link: "https://twitch...xor" },
            { platform: "facebook",     link: "https://facebo...xor" },
            { platform: "reddit",       link: "https://reddit...xor" },
            { platform: "linkedin",     link: "https://www.li...os/" },
            { platform: "tiktok",       link: "https://www.ti...ial" },
            { platform: "snapchat",     link: "https://www.sn...om/" },
            { platform: "vkontakte",    link: "https://vk.com...xor" },
            { platform: "deviantart",   link: "https://www.de...xor" },
            { platform: "pinterest",    link: "https://www.pi...ial" },
            { platform: "soundcloud",   link: "https://soundc...oxor" }
        ],
        connections: [                                                              # External api connections are stored here
            { platform: "osu", uuid: "8112146" }
        ]
    },
    following: [                                                                    # Which uuids the user is following
        "5be68a5c-e78b-4ba6-a41a-1c0c4989a7c5",
        "273a9a8c-509d-4c53-a634-339959f69f68",
        "b5767692-7e8a-47a8-82e2-a98a0a606623",
        "bdbb91db-2dda-45c6-8707-7a8df9ed174f",
    ],
    friend_list: {                                                                  # Friendlist is array that contains friends and pending invites
        friends: [                                                                  # Which uuids are added as friends
            "5be68a5c-e78b-4ba6-a41a-1c0c4989a7c5",
            "876714fc-9f4f-49c1-85fc-e105015cc33b",
            "273a9a8c-509d-4c53-a634-339959f69f68",
            "b5767692-7e8a-47a8-82e2-a98a0a606623",
            "db7f76aa-f26e-4429-9e0b-88168bc5c066",
            "bdbb91db-2dda-45c6-8707-7a8df9ed174f",
            "9e3b4ca7-1d43-4dec-b486-374eecff1e71",
        ]
        pending: [                                                                  # Which uuids the user added or added them
            "273a9a8c-509d-4c53-a634-339959f69f68",
            "b5767692-7e8a-47a8-82e2-a98a0a606623",
            "bdbb91db-2dda-45c6-8707-7a8df9ed174f",
        ]
    },
    settings: {
        show_nsfw: true,                                                            # If we show NSFW marked content or not
        language: "english",                                                        # Language setting the user ha
        account: {                                                                  # Contains private account information         
            email: "geoxor123@outlook.com",                                         # Contains user's email, also editable
            password: "$2b$12$.wpYoDQEdJY3VidOm.2yNORtLtkdZVYrZwwYDJcX5XXK7T6gRV",  # Hashed SHA-256 password
        },
        appearance: {                                                               # Contains the personalisation settings
            darkmode: true,                                                         # Darkmode enabled or not
            animate_pfps: true,                                                     
            theme_color: "#fe7692",                                                 # Customizable theme color
            flare: {
                enabled: true,                                                      # If they have their 
                content: "Ganyu",                                                   # Flare text
                color: "#fce3c5"                                                    # Flare color
            }
        },
        sounds: {
            typing: { 
                enabled: true,                                                      # If its enabled
                url: "http://taku.moe:8880/uploads/VR_drum_hat_trappy.wav" },     # Sound URL
            mention: { 
                enabled: true,                                                      # If its enabled
                url: "http://taku.moe:8880/uploads/id.mp3" },                     # Sound URL
        },
        notifications: {
            disable_all: false,                                                     # Are all their notifications enabled or not
            messages: true,                                                         # Are messages notifications enabled or not
            posts: true,                                                            # Are posts notifications enabled or not    
            comments: true,                                                         # Are comments notifications enabled or not   
            friend_requests: true,                                                  # Are friend request notifications enabled or not              
            follows: true                                                           # Are new follow notifications enabled or not    
            emails: true                                                            # Are email notifications enabled or not    
        },
        privacy: {
            show_status: true,                                                      # If they show their online/offline status on their profile
            blocked_users: ["4ea2f14f-811a-46b5-876b-feae639ce33c"]                 # Array that contains uuids of all the blocked users
        },
    }
    notifications:  [                                                               # This will be added from the aggregation combining both collections together before sending them
        { 
            uuid: 1,                                                     # Unique   # Notification uuid to tell them apart
            type: "Friend Request",                                                 # Notification type
            from: "273a9a8c-509d-4c53-a634-339959f69f68",                           # The user the notification came from
            created_at: 1613655545,                                                 # Epoch date
            read: false,                                                            # If the notification has been read or not
        },
        { 
            uuid: 2,
            type: "Comment",
            content: "Nice bomba"                                                   # If theres a message included show them here
            post_uuid: "28asd32-aassuhb-c02c8c",                                    # If the notification is about a certain post 
            from: "273a9a8c-509d-4c53-a634-339959f69f68",
            created_at: 1613655545,
            read: false,
        },
        { 
            uuid: 3,
            type: "Message",
            content: "FUN FACT I 'AVE A GTX 1080 CLASSIFIED?"
            channel_uuid: "273a9a8c-509d-4c53-a634-339959f69f68",                   # The channel the message notification came from, every channel has their own unique id, even dm:s
            created_at: 1613655545,
            read: false,
        },
        { 
            uuid: 4,
            type: "Post",
            post_uuid: "273a9a8c-509d-4c53-a634-339959f69f68",                      # The post the notification came from, every post has their own unique id:s
            created_at: 1613655545,
            read: false,
        },
        { 
            s: 5,
            type: "Follow",
            from: "273a9a8c-509d-4c53-a634-339959f69f68", 
            created_at: 1613655545,
}

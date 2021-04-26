import axios from 'axios'

const DEV_MODE = false;                          // Determines if the app is in development mode, disables https and other stuff for compability
let ROOT_PATH = 'https://taku.moe';
const BACKEND_PORT = '2087';

if(DEV_MODE) ROOT_PATH = 'http://localhost';

class API {
    constructor(){
    }

    static log(...messages) {
        console.log("%c[API]", 'color: #ff0066; font-weight: bold;', ...messages);
    }

    static async postRequest(route, endpoint, params, body){
        const response = await axios.post(`${ROOT_PATH}:${BACKEND_PORT}/${route}/${endpoint}/${params}`, body || undefined, {
            withCredentials: true
        });

        if(response.data.message) API.log(response.data.message);
        else if(response.data) API.log(response.data);
    }
};


class Channels extends API {
    constructor(){
        super();
        API.log('Initialized channel handler');        
    }

    async pin(channelUuid){
        API.postRequest('channels', 'pin', channelUuid)
    }

    async unpin(channelUuid){
        API.postRequest('channels', 'unpin', channelUuid)
    }
}
 
class Notifications extends API {
    constructor() {
        super();
        API.log('Initialized notification handler');
    }
}

class Users extends API {
    constructor() {
        super();
        API.log('Initialized user handler');
    }
}

console.log("[API] Class Loaded");
const api = {
    channels: new Channels,
    notifications: new Notifications,
    users: new Users,
    DEV_MODE: DEV_MODE,
}; 

console.log(api);

export default api;
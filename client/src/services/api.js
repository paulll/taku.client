import axios from 'axios'

const DEV_MODE = false;                          // Determines if the app is in development mode, disables https and other stuff for compability
let ROOT_PATH = 'https://taku.moe';
const BACKEND_PORT = '2087';

if(DEV_MODE) ROOT_PATH = 'http://localhost';

class API {
    log(...messages) {
        console.log("%c[API]", 'color: #ff0066; font-weight: bold;', ...messages);
    }

    logResponse(response){
        if(response.data.message) this.log(response.data.message);
        else if(response.data) this.log(response.data);
    }

    async postRequest(route, endpoint, params, body){
        this.logResponse(await axios.post(`${ROOT_PATH}:${BACKEND_PORT}/${route}/${endpoint}/${params}`, body || undefined, {
            withCredentials: true
        }));
    }

    async getRequest(route, endpoint, params){
        const response = await axios.get(`${ROOT_PATH}:${BACKEND_PORT}/${route}/${endpoint}/${params}`, {
            withCredentials: true
        });

        this.logResponse(response);

        return response.data
    }
};


class Channels extends API {
    constructor(){
        super();
        super.log('Initialized channel handler');
    }

    async pin(channelUuid){
        super.postRequest('channels', 'pin', channelUuid)
    }

    async unpin(channelUuid){
        super.postRequest('channels', 'unpin', channelUuid)
    }
}
 
class Notifications extends API {
    constructor() {
        super();
        super.log('Initialized notification handler');
    }
}

class User extends API {
    constructor() {
        super();
        super.log('Initialized user handler');
    }

    async fetchMe(){
        super.getRequest('user');
    }
}

console.log("[API] Class Loaded");
const api = {
    channels: new Channels,
    notifications: new Notifications,
    user: new User,
    DEV_MODE: DEV_MODE,
}; 

console.log(api);

export default api;
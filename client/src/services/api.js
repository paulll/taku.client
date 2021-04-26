import axios from 'axios'

const DEV_MODE = false;                          // Determines if the app is in development mode, disables https and other stuff for compability
let ROOT_PATH = 'https://taku.moe';
const BACKEND_PORT = '2087';

if(DEV_MODE) ROOT_PATH = 'http://localhost';

class API {

    /**
     * Custom log function with API suffix
     * @private
     */
    log(...messages) {
        console.log("%c[API]", 'color: #ff0066; font-weight: bold;', ...messages);
    }

    /**
     * Creates a pretty log for the API responses
     * @private
     */
    logResponse(response){
        if(response.data.message) this.log(response.data.message);
        else if(response.data) this.log(response.data);
        else this.log(response)

        console.log(response);
    }

    /**
     * Creates a backend URL with the provided paramaters
     * @private
     */
    constructEndpoint(route, params){
        let endpoint = `${ROOT_PATH}:${BACKEND_PORT}/${route}`;
        if (params) endpoint = endpoint + `/${params}`;

        return endpoint 
    }

    /**
     * 
     * Creates a new POST request to the backend
     * 
     * @param {String} route The route you wanna make a request to e.g. channels/pin
     * @param {String} params Any optional params the url should have e.g. channels/pin/:channel_uuid
     * @param {Object} body An optional body object to send to the route
     * @example 
     * 
     * const response = super.postRequest('channels/group', undefined, body);
     * 
     */
    async postRequest(route, params, body){
        const response = await axios.post(this.constructEndpoint(route, params), body || undefined, {
            withCredentials: true
        });

        this.logResponse(response);
        return response;
    }

    /**
     * 
     * Creates a new GET request to the backend
     * 
     * @param {String} route The route you wanna make a request to e.g. channels/pin
     * @param {String} params Any optional params the url should have e.g. channels/pin/:channel_uuid
     * @example 
     * 
     * const response = super.getRequest('user');
     * 
     */
    async getRequest(route, params){
        const response = await axios.get(this.constructEndpoint(route, params), {
            withCredentials: true
        });

        this.logResponse(response);
        return response;
    }

    /**
     * 
     * Creates a new DELETE request to the backend
     * 
     * @param {String} route The route you wanna make a request to e.g. channels/group
     * @param {String} params Any optional params the url should have e.g. channels/group/:channel_uuid
     * @example 
     * 
     * const response = super.deleteRequest('channels/group', channelUuid);
     * 
     */
    async deleteRequest(route, params){
        const response = await axios.delete(this.constructEndpoint(route, params), {
            withCredentials: true
        });

        this.logResponse(response);
        return response;
    }
};


class Channels extends API {
    constructor(){
        super();
        super.log('Initialized channel handler');
    }

    async pin(channelUuid){
        super.postRequest('channels/pin', channelUuid)
    }

    async unpin(channelUuid){
        super.postRequest('channels/unpin', channelUuid)
    }

    async createGroup(body){
        return super.postRequest('channels/group', undefined, body);
    }

    async deleteGroup(channelUuid){
        return super.deleteRequest('channels/group', channelUuid);
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
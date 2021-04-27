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
     * Creates a new POST request to the backend
     * @param {String} route The route you wanna make a request to e.g. channels/pin
     * @param {String} params Any optional params the url should have e.g. channels/pin/:channel_uuid
     * @param {Object} body An optional body object to send to the route
     * @example const response = super.postRequest('channels/group', undefined, body);
     */
    async postRequest(route, params, body, headers){
        if(headers) {
            const response = await axios.post(this.constructEndpoint(route, params), body || undefined, {
                withCredentials: true,
                headers,
            });

            this.logResponse(response);
            return response;
        } else {
            const response = await axios.post(this.constructEndpoint(route, params), body || undefined, {
                withCredentials: true
            });

            this.logResponse(response);
            return response;
        }
    }

    /**
     * Creates a new GET request to the backend
     * @param {String} route The route you wanna make a request to e.g. channels/pin
     * @param {String} params Any optional params the url should have e.g. channels/pin/:channel_uuid
     * @example const response = super.getRequest('user');
     */
    async getRequest(route, params, headers){
        if(headers) {
            const response = await axios.get(this.constructEndpoint(route, params), {
                withCredentials: true,
                headers: headers
            });

            this.logResponse(response);
            return response;
        } else {
            const response = await axios.get(this.constructEndpoint(route, params), {
                withCredentials: true
            });

            this.logResponse(response);
            return response;
        }
    }

    /**
     * Creates a new DELETE request to the backend
     * @param {String} route The route you wanna make a request to e.g. channels/group
     * @param {String} params Any optional params the url should have e.g. channels/group/:channel_uuid
     * @example const response = super.deleteRequest('channels/group', channelUuid);
     */
    async deleteRequest(route, params){
        const response = await axios.delete(this.constructEndpoint(route, params), {
            withCredentials: true
        });

        this.logResponse(response);
        return response;
    }
};

/**
 * Handles all the endpoint functions for Channels
 */
class Channels extends API {
    constructor(){
        super();
        super.log('Initialized channel handler');
    }

    /**
     * Gets all of the users channels
     */
    async getChannels(){
        return super.getRequest('channels');
    }

    /**
     * Gets specific channel
     * @param {String} channelUuid The UUID of the channel that is being fetched from the database
     * @param {Number} messageOffset (OPTIONAL) The offset, how many latest messages will be skipped on fetch
     */
    async getChannel(channelUuid, messageOffset){
        var params;
        if(messageOffset !== undefined) {
            params = `${channelUuid}/${messageOffset}`
        } else {
            params = channelUuid;
        }
        return super.getRequest('channels', params);
    }

    /**
     * Sends a message to specific channel
     * @param {FormData} formData The data of the message
     */
    async sendMessage(formData) {
        return super.postRequest('message', undefined, formData, {'Content-Type': 'multipart/form-data'})
    }
    
    /**
     * Gets all of the users invites
     */
    async getInvites(){
        return super.getRequest('channels/invites');
    }
    
    /**
     * Pins a channel
     * @param {String} channelUuid The UUID of the channel to pin
     * @example api.channels.pin(channel.uuid);
     */
    async pin(channelUuid){
        super.postRequest('channels/pin', channelUuid);
    }

    /**
     * Unpins a channel
     * @param {String} channelUuid The UUID of the channel to pin
     * @example api.channels.unpin(channel.uuid);
     */
    async unpin(channelUuid){
        super.postRequest('channels/unpin', channelUuid);
    }

    /**
     * Creates a group
     * @param {Object} body An object containing group properties such as name & participants
     * @example api.channels.createGroup({name: "new group", participants: ["user_uuid1", "user_uuid2"]});
     */
    async createGroup(body){
        return super.postRequest('channels/group', undefined, body);
    }

    /**
     * Deletes a group
     * @param {String} channelUuid The UUID of the channel to delete
     * @example api.channels.deleteGroup(channel_uuid);
     */
    async deleteGroup(channelUuid){
        return super.deleteRequest('channels/group', channelUuid);
    }
}
 

/**
 * Handles all the endpoint functions for Notifications
 */
class Notifications extends API {
    constructor() {
        super();
        super.log('Initialized notification handler');
    }
}

/**
 * Handles all the endpoint functions for User
 */
class User extends API {
    constructor() {
        super();
        super.log('Initialized user handler');
    }

    /**
     * Post login credentials into backend and returns the login token on successful login
     * @param {Object} json Json object, which contains login credentials
     */
    async login(json){ 
        return super.postRequest('login', undefined, json, {'Content-Type': 'application/json'});
    }

    /**
     * Post signup credentials into backend and returns the result of signup process
     * @param {Object} json Json object, which contains signup credentials
     */
     async signup(json){ 
        return super.postRequest('signup', undefined, json, {'Content-Type': 'application/json'});
    }

    /**
     * Returns the user object of the logged in user, takes no input parameters
     */
    async fetchMe(){
        return (await super.getRequest('user')).data;
    }

    /**
     * Returns a user object from the database
     * @param {String} username The username, whose user-object we are fetching from the database
     */
    async fetchUser(username){
        return (await super.getRequest('user', username, { 'Access-Control-Allow-Origin': '*' }));
    }

    /**
     * Uploads a file for the user's settings
     * @param {FormData} formData The username, whose user-object we are fetching from the database
     * 
     */
    async uploadFile(formData){
        return super.postRequest('settings/upload', undefined, formData, {'Content-Type': 'multipart/form-data'});
    }

    /**
     * Reposts the settings object into the user's settings property in the database
     * @param {Object} me Logged in users user-object, which contains all information of the user
     */
    async updateSettings(me){
        return super.postRequest('settings', undefined, me, {'Content-Type': 'application/json'});
    }

    /**
     * Interfaces with the users friends for example to Add, delete or update a relationship
     * @param {String} params Either add or remove, tells backend are we adding this user as friend or removing them from friends
     * @param {String} uuid The users uuid that is being added to friends or removed from friends commited
     */
    async updateFriend(params, uuid) {
        return super.postRequest('friend', params, {uuid}, {'Content-Type': 'application/json'});
    }

    /**
     * Returns the list of blocked users by logged in user
     */
    async fetchBlockedUsers() {
        return super.getRequest('user/blockedUsers')
    }
}

class Anime extends API {
    constructor() {
        super();
        super.log('Initialized anime handler');
    }

    /**
     * Gets the anime object from database from the provided anime id
     * @param {String} animeID The ID of the anime that is beign fetched from database
     */
    async getAnime(animeID) {
        return super.getRequest('anime/id', animeID, { 'Access-Control-Allow-Origin': '*' });
    }

    /**
     * Toggles the bookmark of the anime for specific user
     * @param {Object} json The json of the currently bookmarked animes
     */
    async toggleAnime(json) {
        return super.postRequest('user/anime', undefined, json, {'Content-Type': 'application/json'});
    }
}

console.log("[API] Class Loaded");
const api = {
    channels: new Channels,
    notifications: new Notifications,
    user: new User,
    anime: new Anime,
    DEV_MODE: DEV_MODE,
}; 

console.log(api);

export default api;
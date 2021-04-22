
class Cache {
    constructor(){
        let cache = JSON.parse(localStorage.cache);

        if (cache == null) localStorage.setItem("cache", JSON.stringify({}));
        if (cache.channels == null) cache.channels = {};
        if (cache.messages == null) cache.messages = {};

        this.channels = {};
        this.messages = {};
    }

    /** 
     * Updates the localstorage by stringifying the current object in RAM
     * @private
     * */
    static updateLocalStorage(object){
        this.log();
        localStorage.cache = JSON.stringify(object);
    }

    /**
     * Forcefully refresh RAM cache from localstorage
     * @private
     */
    static forceRefresh(){
        let cache = JSON.parse(localStorage.cache);
        this.channels = cache.channels;
        this.messages = cache.messages;
    }

    /**
     * Returns everything from RAM cache
     * @public
     */
    static getAll(){
        return this;
    }

    /**
     * Returns all cached messages from a channel
     * @public
     */
    static getMessages(channel){
        return this.messages;
    }

    /**
     * Returns all cached channels
     * @public
     */
    static getChannels(){
        return this.channels;
    }

    /**
     * Updates localstorage with all channels provided
     * @public
     */
    static syncChannels(channels){
        this.channels = channels;
        updateLocalStorage(this);
    }

    /**
     * Updates localstorage with all messages provided
     * @public
     */
    static syncMessages(channel, messages){
        if (typeof this.messages[channel] === 'undefined') this.appendChannel(channel);
        this.messages[channel] = messages;
        updateLocalStorage(this);
    }

    /**
     * Allocates channel to the cache
     * @public
     */
    static createChannel(channel){
        this.channels[channel] = {};
    }

    /**
     * Appends a single provided channel to the cache
     * @public
     */
    static appendChannel(channel){
        this.channels.push(channel);
        updateLocalStorage(this);
    }

    /**
     * Appends a single provided message to the cache
     * @public
     */
    static appendMessage(message){
        this.messages.push(message);
        updateLocalStorage(this);
    }

    /**
     * Logs whats inside the RAM cache currently
     * @public
     */
    static log(){
        console.log(this.channels, this.messages);
    }
};

export default Cache;
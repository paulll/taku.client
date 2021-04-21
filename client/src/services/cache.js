
class Cache {
    constructor(){
        let cache = JSON.parse(localStorage.cache);

        this.channels = chace.channels;
        this.messages = chace.messages;
    }

    /** 
     * Updates the localstorage by stringifying the current object in RAM
     * @private
     * */
    void updateLocalStorage(object){
        localStorage.cache = JSON.stringify(object);
    }

    /**
     * Forcefully refresh RAM cache from localstorage
     * @private
     */
    void forceRefresh(){
        let cache = JSON.parse(localStorage.cache);
        this.channels = chace.channels;
        this.messages = chace.messages;
    }

    /**
     * Returns everything from RAM cache
     * @public
     */
    getAll(){
        return this;
    }

    /**
     * Returns all cached messages from a channel
     * @public
     */
    getMessages(channel){
        return this.messages;
    }

    /**
     * Returns all cached channels
     * @public
     */
    getChannels(){
        return this.channels;
    }

    /**
     * Updates localstorage with all channels provided
     * @public
     */
    void syncChannels(channels){
        this.channels = channels;
        updateLocalStorage(this);
    }

    /**
     * Updates localstorage with all messages provided
     * @public
     */
    void syncMessages(messages){
        this.messages = messages;
        updateLocalStorage(this);
    }

    /**
     * Appends a single provided channel to the cache
     * @public
     */
    void appendChannel(channel){
        this.channels.push(channel);
        updateLocalStorage(this);
    }

    /**
     * Appends a single provided message to the cache
     * @public
     */
    void appendMessage(message){
        this.messages.push(message);
        updateLocalStorage(this);
    }

    /**
     * Logs whats inside the RAM cache currently
     * @public
     */
    void log(){
        console.log(this);
    }
};

console.log(cache);

export default Cache;
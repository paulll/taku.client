
class Cache {
    constructor(){
        let cache = JSON.parse(localStorage.cache);

        this.channels = chace.channels;
        this.messages = chace.messages;
    }

    /** 
     * @private
     * 
     * Updates the localstorage by stringifying the current object in ram
     * */
    updateLocalStorage(object){
        localStorage.cache = JSON.stringify(object);
    }

    /**
     * @private
     * if for some reason we have to forcefully refresh from localstorage
     */
    forceRefresh(){
        let cache = JSON.parse(localStorage.cache);
        this.channels = chace.channels;
        this.messages = chace.messages;
    }

    /**
     * @public
     * Returns everything from ram
     */
    getAll(){
        return this;
    }

    /**
     * @public
     * Returns all cached messages from a channel
     */
    getMessages(channel){
        return this.messages;
    }

    /**
     * @public
     * Returns all cached channels
     */
    getChannels(){
        return this.channels;
    }

    /**
     * @public
     * updates localstorage with all channels provided
     */
    syncChannels(channels){
        this.channels = channels;
        updateLocalStorage(this);
    }

    /**
     * @public
     * updates localstorage with all messages provided
     */
    syncMessages(messages){
        this.messages = messages;
        updateLocalStorage(this);
    }
    
    // appends a single provided channel to the cache;
    appendChannel(channel){
        this.channels.push(channel);
        updateLocalStorage(this);
    }

    // appends a single provided message to the cache;
    appendMessage(message){
        this.messages.push(message);
        updateLocalStorage(this);
    }

};

export default Cache;
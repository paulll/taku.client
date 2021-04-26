class Cache {
    constructor(){
        Cache.log("Constructed Cache");
        if (!localStorage.cache || localStorage.cache === 'undefined') Cache.initCache();
        this.cache = JSON.parse(localStorage.cache);
        if (this.cache == null) Cache.initCache();
    }

    static log(...messages) {
        console.log("%c[CACHE]", 'color: #c3ff00; font-weight: bold;', ...messages);
    }

    static initCache(){
        this.cache = {
            channels: {},
        };
        localStorage.setItem("cache", JSON.stringify(this.cache));
        Cache.log("Initialized Cache");
    }

    updateLocalStorage(){
        localStorage.setItem('cache', JSON.stringify(this.cache));
        Cache.log("Local storage Updated");
    }

    updateChannel(channel){
        Cache.log("Local storage Updated");
        this.cache.channels[channel.uuid] = channel;
        cache.updateLocalStorage();
    }

    updateMessages(channelUuid, messages){
        this.cache.channels[channelUuid].messages = messages;
        cache.updateLocalStorage();
    }

    appendMessage(channelUuid, message){
        if(!this.cache.channels[channelUuid].messages) this.cache.channels[channelUuid].messages = [];
        this.cache.channels[channelUuid].messages.push(message);
        cache.updateLocalStorage();
    }

    getChannels(){
        return this.cache.channels;
    }

    getChannel(channelUuid){
        return this.cache.channels[channelUuid];
    }

    forceRefresh(){
        this.cache = JSON.parse(localStorage.cache);
    }
};

console.log("[CACHE] Class Loaded");
const cache = new Cache; 
export default cache;
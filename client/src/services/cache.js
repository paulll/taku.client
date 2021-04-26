class Cache {
    constructor(){
        Cache.log("Constructed Cache");
        if (!localStorage.cache || localStorage.cache === 'undefined') Cache.initCache();
        this.cache = JSON.parse(localStorage.cache);
        if (this.cache == null) Cache.initCache();
    }

    static log(...messages) {
        console.log("[CACHE]", ...messages);
    }

    static initCache(){
        this.cache = {
            channels: {},
            messages: {}, 
        };
        localStorage.setItem("cache", JSON.stringify(this.cache));
        Cache.log("Initialized Cache");
    }

    updateLocalStorage(){
        console.log(this.cache);
        localStorage.setItem('cache', JSON.stringify(this.cache));
        Cache.log("Local storage Updated");
    }

    updateChannel(channel){
        this.cache.channels[channel.uuid] = channel;
        cache.updateLocalStorage();
    }

    appendMessage(message){
        this.cache.messages.push(message);
        cache.updateLocalStorage();
    }

    getChannels(){
        Cache.log("Got channels");
        return this.cache.channels;
    }

    forceRefresh(){
        this.cache = JSON.parse(localStorage.cache);
    }
};

console.log("[CACHE] Class Loaded");
const cache = new Cache; 
export default cache;
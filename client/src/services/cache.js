
class Cache {
    constructor(){
        let cache = JSON.parse(localStorage.cache);

        if (cache == null) localStorage.setItem("cache", JSON.stringify({}));
        if (cache.channels == null) cache.channels = {};
        if (cache.messages == null) cache.messages = {};

        this.channels = {};
        this.messages = {};
    }

    static updateLocalStorage(object){
        this.log();
        localStorage.cache = JSON.stringify(object);
    }

    static forceRefresh(){
        let cache = JSON.parse(localStorage.cache);
        this.channels = cache.channels;
        this.messages = cache.messages;
    }

    static getAll(){
        return this;
    }

    static getMessages(channel){
        return this.messages;
    }

    static getChannels(){
        return this.channels;
    }

    static syncChannels(channels){
        this.channels = channels;
        updateLocalStorage(this);
    }

    static syncMessages(channel, messages){
        if (typeof this.messages[channel] === 'undefined') this.appendChannel(channel);
        this.messages[channel] = messages;
        updateLocalStorage(this);
    }

    static createChannel(channel){
        this.channels[channel] = {};
    }

    static appendChannel(channel){
        this.channels.push(channel);
        updateLocalStorage(this);
    }

    static appendMessage(message){
        this.messages.push(message);
        updateLocalStorage(this);
    }

    static log(){
        console.log(this.channels, this.messages);
    }
};

export default Cache;
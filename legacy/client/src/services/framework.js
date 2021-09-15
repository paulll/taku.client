class Framework {
    isEmpty(any){
        return (any == null || any === '' || any.length == 0 || any == undefined || any === 'undefined') ? true : false;
    }
};

console.log("[FRAMEWORK] Class Loaded");
const framework = new Framework; 
export default framework;
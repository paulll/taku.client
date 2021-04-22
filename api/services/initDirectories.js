const fs = require('fs');

module.exports = {
    initDirectories() {
        // Check if the folder exists, if not then create it
        if(!fs.existsSync('./db/wallpapers')) {
            fs.mkdirSync('./db/wallpapers');
            fs.mkdirSync('./db/wallpapers/static');
        }
    }
}
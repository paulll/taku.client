const fs = require('fs');

const DEV_MODE = true;                          // Determines if the app is in development mode, disables https and other stuff for compability

if(DEV_MODE) {
    var public = 'localhost';
    var port = 80;
    var https = false;
} else {
    var public = 'taku.moe';
    var port = 443;
    var https = true;
}

module.exports = {
    devServer: {
        public,
	    port,
        disableHostCheck: true,
        https,
        cert: fs.readFileSync('./cert.pem'),
        key: fs.readFileSync('./key.pem'),
    },
}
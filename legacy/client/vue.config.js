const fs = require('fs');

var public = 'localhost';
var port = 80;
var https = false;

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
const fs = require('fs');

module.exports = {
    devServer: {
	    port: 8080,
        disableHostCheck: true,
        cert: fs.readFileSync('./cert.pem'),
        key: fs.readFileSync('./key.pem'),
    },
}
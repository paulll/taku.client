const fs = require('fs');

module.exports = {
    devServer: {
        public : 'taku.moe',
	    port: 443,
        disableHostCheck: true,
        https: true,
        cert: fs.readFileSync('./cert.pem'),
        key: fs.readFileSync('./key.pem'),
    },
}
const fs = require('fs');

module.exports = {
    devServer: {
        hot: false,
	    port: 2096,
        disableHostCheck: true,
        https: true,
        cert: fs.readFileSync('./cert.pem'),
        key: fs.readFileSync('./key.pem'),
    },
}
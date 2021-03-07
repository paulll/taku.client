const SMTPConnection = require("nodemailer/lib/smtp-connection");

function connectToMail() {
    let options = {};
    options.port = 465;
    options.host = "smtp.taku.moe";
    options.secure = true;

    let connection = new SMTPConnection(options);
    console.log(connection);

}

module.exports = connectToMail;
const PORT = 465;
const SMTPServer = require("smtp-server").SMTPServer;
const fs = require("fs");
const server = new SMTPServer({
    secure: true,
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem")
});
server.listen(PORT);

console.log("[SMTP]".bgYellow.black, `Started on port ${PORT.toString().red}`);


server.on("error", err => {
    console.log("Error %s", err.message);
});

module.exports = server;
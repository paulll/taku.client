const Jimp = require("jimp");
const fs = require("fs");

process.on('message', attachment => {
    console.log('[CHILD]: Received image from server:', attachment);

    // Add a unique string at the start of the file so files don't overwrite each other
    attachment.originalname = `${new Date().getTime().toString()}-${attachment.originalname.replace(/\s/g, "_")}`; // Remove spaces with underscores
    
    // Send both original and cached files
    attachment.originalurl = `http://taku.moe:8880/uploads/${attachment.originalname}`;
    attachment.html = `http://taku.moe:8880/uploads/cache/${attachment.originalname}`;
    
    Jimp.read(`./db/uploads/${attachment.filename}`, async (err, image) => {
        if (err) throw err;

        // Resize file
        if (image.bitmap.width > 368) {
          image.resize(Jimp.AUTO, 368) // resize
        }
  
        // Save the cached file
        image.write(`./db/uploads/cache/${attachment.originalname}`); // save

        // Rename the original extentionless file to the original name
        fs.renameSync(`./db/uploads/${attachment.filename}`, `./db/uploads/${attachment.originalname}`);

        // Send results
        process.send({
            child: process.pid,
            result: attachment
        });

        // Kill itself
        process.disconnect();
    });
});
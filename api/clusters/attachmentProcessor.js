const Jimp = require("jimp");
const fs = require("fs");

process.on('message', attachment => {

    // Add a unique string at the start of the file so files don't overwrite each other
    attachment.originalname = `${new Date().getTime().toString()}-${attachment.originalname.replace(/\s/g, "_")}`; // Remove spaces with underscores
    
    // Send original
    attachment.originalurl = `https://taku.moe:2087/uploads/${attachment.originalname}`;

    // Check if image is readable by Jimp
    if(!attachment.mimetype.startsWith("image/")){
        
        // Rename the original extentionless file to the original name
        fs.renameSync(`./db/uploads/${attachment.filename}`, `./db/uploads/${attachment.originalname}`);
        
        // Send original file
        attachment.html = attachment.originalurl;

        // Send results
        process.send({
            child: process.pid,
            result: attachment
        });

        // Kill itself
        process.disconnect();
        return
    }


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

        // Send new cached file
        attachment.html = `https://taku.moe:2087/uploads/cache/${attachment.originalname}`;

        // Send results
        process.send({
            child: process.pid,
            result: attachment
        });

        // Kill itself
        process.disconnect();
    });
});
const Jimp = require("jimp");
const fs = require("fs");

function finish(attachment){
    fs.renameSync(`./db/uploads/${attachment.filename}`, `./db/uploads/${attachment.originalname}`);  // Rename the original extentionless file to the original name
    attachment.html = `https://taku.moe:2087/uploads/cache/${attachment.originalname}`;               // Send new cached file
    process.send({child: process.pid, result: attachment});                                           // Send results
    process.disconnect();
}

process.on('message', attachment => {
    attachment.originalname = `${new Date().getTime().toString()}-${attachment.originalname.replace(/\s/g, "_")}`; // Parse filename
    attachment.originalurl = `https://taku.moe:2087/uploads/${attachment.originalname}`; // Send original
    
    if(!attachment.mimetype.startsWith("image/")) return finish(attachment); // Check if image is readable by Jimp
    
    Jimp.read(`./db/uploads/${attachment.filename}`, async (err, image) => {
        if (err) throw err;
        
        if (image.bitmap.width > 368) image.resize(Jimp.AUTO, 368)     // Resize file
        image.write(`./db/uploads/cache/${attachment.originalname}`);  // Save the cached file
        finish(attachment);                                        
    });
});
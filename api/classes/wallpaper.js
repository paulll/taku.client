const { v4: uuidv4 } = require("uuid");

function Wallpaper(image, jimpImage, metadata) {

    if (!image)     throw "'image' object must be provided for a Wallpaper";
    if (!jimpImage) throw "'jimpImage' object must be provided for a Wallpaper";
    if (!metadata)  throw "'metadata' object must be provided for a Wallpaper";

    if (metadata.submitter === undefined)      throw "'submitter_uuid' must be provied in metadata";
    if (metadata.anime_uuid === undefined)     throw "'anime_uuid' must be provied in metadata";
    if (metadata.season === undefined)         throw "'season' must be provied in metadata";
    if (metadata.episode === undefined)        throw "'episode' must be provied in metadata";
    if (metadata.timestamp === undefined)      throw "'timestamp' must be provied in metadata";
    if (metadata.is_nsfw === undefined)        throw "'is_nsfw' must be provied in metadata";
    if (metadata.tags === undefined)           throw "'tags' must be provied in metadata";

    this.uuid = uuidv4();                              // UUID of the Wallpaper
    this.created_at = new Date().getTime();            // Wallpaper creation date
    
    this.submitter      = metadata.submitter;          // The UUID of the user who submitted the Wallpaper in the database
    this.anime_uuid     = metadata.anime_uuid;         // The UUID of the anime the wallpaper comes from
    this.season         = parseInt(metadata.season);   // The season of the series the wallpaper comes from
    this.episode        = parseInt(metadata.episode);  // The episode of the series the wallpaper comes from
    this.timestamp      = metadata.timestamp;          // The timestamp of the series the wallpaper comes from
    this.is_nsfw        = metadata.is_nsfw;            // If the wallpaper is from an NSFW series (dem tiddies ( ͡° ͜ʖ ͡°))
    this.tags           = metadata.tags;               // The tags of the wallpaper
    
    this.likes = [];                                   // The amount of likes of the wallpaper 
    this.downloads = 0;                                // The amount of downloads of the wallpaper 
    this.saves = [];                                   // The amount of saves of the wallpaper                                                    
    this.is_verified = false;                          // If the Wallpaper has been approved by a moderator/community so it shows up on the home feed
    
    this.filename = jimpImage.filename;
    this.resolution = `${jimpImage.bitmap.width}x${jimpImage.bitmap.height}`;  // The tags of the Wallpaper 
    this.extension = image.originalname.split('.')[image.originalname.split('.').length -1];
    this.size = image.size;
}

module.exports = {
    name: "Wallpaper",
    constructor: Wallpaper
}
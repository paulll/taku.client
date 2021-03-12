const { v4: uuidv4 } = require("uuid");
 
function Anime(title, year, description, submitter_uuid, is_nsfw, tags) {
    if (!title)          return new Error("'title' must be provided for an Anime");
    if (!year)           return new Error("'year' must be provided for an Anime");
    if (!description)    return new Error("'description' must be provided for an Anime");
    if (!submitter_uuid) return new Error("'submitter_uuid' must be provided for an Anime");
    if (!is_nsfw)         return new Error("'nsfw' must be provided for an Anime");
    if (!tags)           return new Error("'tags' must be provided for an Anime");

    this.uuid = uuidv4();                       // UUID of the Anime
    this.created_at = new Date().getTime();     // Anime creation date
    this.submitter = submitter_uuid;            // The UUID of the user who submitted the anime in the database
    
    this.title = title;                         // The title of the anime 
    this.year = year;                           // The year of the anime 
    this.description = description;             // The description of the anime 
    this.submitter_uuid = submitter_uuid;       // The submitter_uuid of the anime 
    this.is_nsfw = is_nsfw;                       // if the anime is NSFW
    this.tags = tags;                           // The tags of the anime 
    
    this.isVerified = false;                    // If the anime has been approved by a moderator/community so it shows up on the home feed
    this.wallpapers = [];                       // The list of all the wallpapers associated with this anime
};

module.exports = {
    name: "Anime",
    constructor: Anime
}
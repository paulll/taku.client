import { v4: uuidv4 } from "uuid";

declare module "wallpaper" {
    export default class Wallpaper {
        
        // Attributes
        uuid: string;
        created_at: number;
        title: string;
        year: number;
        description: string;
        submitter_uuid: string;
        nsfw: boolean;
        tags: string[];
        isVerified: boolean;

        // Constructor of the Wallpaper classs :P
        constructor(title: string, year: number, description: string, submitter_uuid: string, nsfw: boolean, tags: string[]){
            
            this.uuid = uuidv4();                       // UUID of the Anime
            this.created_at = new Date().getTime();     // Anime creation date

            this.title = title;                         // The title of the anime 
            this.year = year;                           // The year of the anime 
            this.description = description;             // The description of the anime 
            this.submitter_uuid = submitter_uuid;       // The UUID of the user who submitted the anime in the database
            this.nsfw = nsfw;                           // The nsfw of the anime 
            this.tags = tags;                           // The tags of the anime 
            
            this.isVerified = false;                    // If the anime has been approved by a moderator/community so it shows up on the home feed

        };
     
    }
}
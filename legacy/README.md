# localhost 

![Taku](https://cdn.discordapp.com/attachments/806300597338767450/822040731048607754/pwa.png)

# API 
This is the full documentation behind the **Taku REST API v1** 

Endpoint: `localhost:2087/`

## Auth
This is the main **login** route
> **`POST /login`**
```json
{
	// Example body
	"username": "YOUR_USERNAME",
	"password": "YOUR_PASSWORD"
}
```

This is the main **signup** route
> **`POST /signup`**
```json
{
	// Example body
	"username": "YOUR_USERNAME",
	"email": "YOUR_EMAIL",
	"password": "YOUR_PASSWORD"
}
```
<br>

## Anime
Gets you **all anime**  on the database
> **`GET /anime/`** 

Gets you a **specific** anime by the **uuid**
> **`GET /anime/id/{anime_uuid}`**
> 
Gets you a selection of **random** anime from the database, the amount defaults to 20 if unspecified
> **`GET /anime/random/{amount}`**


## Wallpapers
Gets you a **specific** wallpaper by the **uuid**
> **`GET /wallpapers/{wallpaper_uuid}`** 

Gets you a selection of **random** wallpapers from **different categories** based on the **amount**
which also have an **offset** allowing you to **fetch more**
> **`GET /wallpapers/random/{amount}/{offset}`** 

> **`GET /wallpapers/trending/{amount}/{offset}`** 

> **`GET /wallpapers/new/{amount}/{offset}`**

To **create a new** wallpaper you need to send a **JSON object** like this
> **`POST /wallpapers/`**
```json
{
	// Example body
	"anime_uuid": "bbbd0f14-e433-46f7-a713-1a73db5bc9f7",
	"season": "1",
	"episode": "3",
	"timestamp": "21:59",
	"is_nsfw": false,
	"tags": [ "sky", "night", "building", "clouds" ]
}
```

Heres all the **interactions** you can have with a **wallpaper**
> **`GET /wallpapers/like/{wallpaper_uuid}`**

> **`GET /wallpapers/dislike/{wallpaper_uuid}`**

> **`GET /wallpapers/save/{wallpaper_uuid}`**

> **`GET /wallpapers/unsave/{wallpaper_uuid}`**

> **`GET /wallpapers/download/{wallpaper_uuid}`**


## Development
When developing the site, change the **`DEV_MODE`** to `true` in *`api/index`*, *`client/vue.config.js`* and *`client/src/main.js`*
This changes the routing from `localhost` to `localhost`

//add your db thing then go to line 155
const puppeteer = require('puppeteer');

const https = require('https');
const http = require('http');
const fs = require('fs');

function downloadfile(DownloadLink, loc, name) {
    const file = fs.createWriteStream(`${loc}/${name}.jpg`);
    if (DownloadLink.substring(0,4) == "http") {const request = http.get(DownloadLink, function(response) {
    response.pipe(file)
})}
if (DownloadLink.substring(0,5) == "https"){const request = https.get(DownloadLink, function(response) {
    response.pipe(file)
})}}


let id = 1;

async function skurape(someURL) {
let browser = await puppeteer.launch({headless: false});  //set false if you wanna see the window

//these disable the "allow notifications" popup
//const context = browser.defaultBrowserContext();
//context.overridePermissions("https://www.reddit.com", ["geolocation", "notifications"]);

let page = await browser.newPage();
//change the max timeout
await page.setDefaultNavigationTimeout(240000);

let linkTOSCRAPE = someURL;       
let stateOfLoop = true;

while (stateOfLoop) {
    await page.goto(linkTOSCRAPE , {waitUntil: 'domcontentloaded'});
    let data = await page.evaluate(()=>{
        let nextPageURL;

        if (!(document.getElementsByClassName("btn btn-primary next disabled").length>0)) {
            nextPageURL = document.querySelector('a[class="btn btn-primary next "]').href
        }else nextPageURL = null;
        
        let maxCNodes = document.querySelector('ul[class="anime-list-v"]').querySelectorAll('li').length;
        
        let linksInPageArray = [];
        for (let iiiii = 0; iiiii < maxCNodes; iiiii++) {
            let nodeInnerTextIDK = document.querySelector('ul[class="anime-list-v"]').querySelectorAll('li')[iiiii].querySelector('div[class="info"] > a').innerText
            if (!nodeInnerTextIDK.toLowerCase().endsWith("(dub)")) {
                linksInPageArray.push(document.querySelector('ul[class="anime-list-v"]').querySelectorAll('li')[iiiii].querySelector('div[class="info"] > a').href)    
            }
            
        }

        return {linksInPageArray, nextPageURL};
    })

    async function getAnimeFromLink(link) {
        let page = await browser.newPage();
        await page.setDefaultNavigationTimeout(240000);
        await page.goto(link, {waitUntil: 'networkidle2'});

        if ((await page.$("span[class=\"more\"]")) != null) {
            await page.click('span[class=\"more\"]');
            await page.waitForTimeout(100)
        }
        let data = await page.evaluate(()=>{

            let id;
        
            let titleFull = document.querySelector('div[class="alias"]').innerText;
            let titlesArray = titleFull.split(',');

            let english;
            let romaji;
            let hiragana;

            switch (titlesArray.length) {
                case 1:
                    english = titlesArray[0];
                    romaji = null;
                    hiragana = null;
                    
                    break;

                case 2:
                    english = titlesArray[0];
                    romaji = titlesArray[1];
                    hiragana = null;
                
                    break;

                case 3:
                    english = titlesArray[0];
                    romaji = titlesArray[1];
                    hiragana = titlesArray[2];
            
                    break;            
                default:
                    break;
            }

            let description = document.querySelector('p[class="shorting"]').innerText;

            let maxMetaNodes = document.querySelector('div[class="col1"]').querySelectorAll('div').length;

            let date_aired;
            let year;
            let tags = [];

            for (let iiiiii = 0; iiiiii < maxMetaNodes; iiiiii++) {
                switch (document.querySelector('div[class="col1"]').querySelectorAll('div')[iiiiii].innerText.split(':')[0]) {
                    case "Date aired":
                            date_aired = document.querySelector('div[class="col1"]').querySelectorAll('div')[iiiiii].querySelector('span').innerText;
                            let dateArray = date_aired.split(',');
                            year = dateArray[dateArray.length - 1];
                        break;
                    case "Genre":
                            for (let iiib = 0; iiib < document.querySelector('div[class="col1"]').querySelectorAll('div')[iiiiii].querySelector('span').querySelectorAll('a').length; iiib++) {
                                tags.push(document.querySelector('div[class="col1"]').querySelectorAll('div')[iiiiii].querySelector('span').querySelectorAll('a')[iiib].innerText)
                            }
                        break;       
                    default:
                        break;
                }
            }

            let rawBackgroundStyleThing;
            let background_url;
            /* if (document.querySelector('div[id="player"]').getElementsByClassName("backdrop").length >0) {
                rawBackgroundStyleThing = document.querySelector('div[id="player"]').querySelector('div[class="backdrop"]').style.backgroundImage;
                background_url = "http:" + rawBackgroundStyleThing.substring(7, rawBackgroundStyleThing.length-2);
            } */
            rawBackgroundStyleThing = document.querySelector('head > meta[property="og:image"]').content;
            background_url = "http:" + rawBackgroundStyleThing.substring(2, rawBackgroundStyleThing.length-5);

            nsfw = tags.includes('Ecchi');
            let thumbnail_url = document.querySelector('div[class="thumb"]').querySelector('img').src;
            return {anime_meta:{title:{
                english,
                romaji,
                hiragana
            },
            description,
            year,
            tags,
            nsfw,
            submitted_by:"Geoxor",
            id},
            thumbnail_url,
            background_url
        }      
        })

        data.anime_meta.id = id++;
        await page.close;
        //download background in background folder 
        downloadfile(data.backgroundImage, "download location", data.anime_meta.id)

        //download thumnail in it's folder
        downloadfile(data.thumbnail_url, "download location", data.anime_meta.id)

        //add the fkn data.anime_meta to either a fkn database or a json

    }
    
        async function getshit(params) {
            for (let iiic = 0; iiic < data.linksInPageArray.length; iiic++) {
                await getAnimeFromLink(value);
                if (index === array.length -1) resolve();
            }
    }

    let parseAnimePromise = new Promise((resolve, reject)=>{
        async function getshit(params) {
            for (let iiic = 0; iiic < data.linksInPageArray.length; iiic++) {
                await getAnimeFromLink(data.linksInPageArray[iiic]);
                if (iiic === data.linksInPageArray.length -1) resolve();
            }
    }
    getshit();
        /* data.linksInPageArray.forEach(async (value, index, array)=>{
            await getAnimeFromLink(value);
            if (index === array.length -1) resolve();
        }) */
    })
    
    await parseAnimePromise;

    console.log(await data);

    if(data.nextPageURL != null){
        linkTOSCRAPE = data.nextPageURL;
    } else stateOfLoop = false;
    
}
await page.close;
await browser.close;
}
skurape("https://www12.9anime.to/az-list");

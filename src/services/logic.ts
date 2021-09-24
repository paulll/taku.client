import { EmbedTypes, IAudioEmbed, IImageEmbed, IProfileEmbed, IVideoEmbed, Embed } from "./types";
import createMarkdownParser from "markdown-it";

const md = createMarkdownParser({linkify: true, typographer: true})

const IMAGE_EXTENSIONS = [".jpg", ".png", ".webp", ".gif", ".jpeg"];
const AUDIO_EXTENSIONS = [".flac", ".ogg", ".aiff", ".mp3", ".wav"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".flv", ".mov"];
const UUID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g;

export const getEmbeds = (string: string | undefined): Embed[] => {
  if (!string) return [];

  const links = string.match(/\bhttps?:\/\/\S+/gi);
  if (!links) return [];

  const embeds = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i].split("?")[0]; // Remove params
    let type: EmbedTypes = null;
    const fileExtension = link.substring(link.lastIndexOf("."));

    if (IMAGE_EXTENSIONS.includes(fileExtension)) {
      type = "image";
      embeds.push({ link, type } as IImageEmbed);
    }
    if (AUDIO_EXTENSIONS.includes(fileExtension)) {
      type = "audio";
      embeds.push({ link, type } as IAudioEmbed);
    }
    if (VIDEO_EXTENSIONS.includes(fileExtension)) {
      type = "video";
      embeds.push({ link, type } as IVideoEmbed);
    }
    if (link.startsWith("https://taku.moe/user/")) {
      const uuid = link.match(UUID_REGEX);
      if (!uuid) continue;
      type = "profile";
      embeds.push({ uuid: uuid[0], type, link } as IProfileEmbed);
    }
  }

  return embeds;
};

export const processMarkdown = (string: string): string => {
  return md.renderInline(string);
}

export const removeTrailingEmbeds = (string: string, embeds: Embed[]): string => {
  if (!string.includes("http")) return string;

  const lastLinkIndex = string.lastIndexOf("http");
  const lastLinkPart = string.slice(lastLinkIndex).trim();
  const lastLinkIsTrailing = !/\s/.test(lastLinkPart);

  if (lastLinkIsTrailing && embeds.some((embed) => embed.link == lastLinkPart)) {
    return removeTrailingEmbeds(string.slice(0, lastLinkIndex).trim(), embeds);
  }
  
  return string;
}

export const addTargetBlankToAnchors = (string: string): string =>  {
  return string.replace(/<a /gi, `<a target="_blank" `);
}

// export const renderLinks = (string: string | undefined) => {
//   if (!string) return;
//   if (!string.includes("http")) return string;

//   const words = string.split(" ");
//   const parsed = [];

//   for (let i = 0; i < words.length; i++) {
//     let word = words[i];
//     if (word.startsWith("http://") || word.startsWith("https://")) {
//       word = word.split('\n')[0]; 
//       parsed.push(`<a target="_blank" href="${word}"">${word}</a>`);
//       continue;
//     }
//     parsed.push(word);
//   }

//   return parsed.join(' ');
// }
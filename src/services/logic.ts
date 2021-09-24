import { EmbedTypes, IAudioEmbed, IImageEmbed, IProfileEmbed, IVideoEmbed, Embed, IAttachment } from "./types";
import createMarkdownParser from "markdown-it";

const md = createMarkdownParser({linkify: true, typographer: true})

const IMAGE_EXTENSIONS = [".jpg", ".png", ".webp", ".gif", ".jpeg", ".apng"];
const AUDIO_EXTENSIONS = [".flac", ".ogg", ".aiff", ".aac", ".mp3", ".wav"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".flv", ".mov"];
const UUID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g;

/**
 * @author Geoxor
 * Parses a link to check if its embedable or not
 * @param link the link to check
 * @returns returns an embed type object for a link
 */
export const getEmbed = (link: string): Embed | undefined => {
  let type: EmbedTypes = null;
  const fileExtension = link.substring(link.lastIndexOf("."));

  if (IMAGE_EXTENSIONS.includes(fileExtension.toLowerCase())) {
    type = "image";
    return { link, type } as IImageEmbed;
  }
  if (AUDIO_EXTENSIONS.includes(fileExtension.toLowerCase())) {
    type = "audio";
    return { link, type } as IAudioEmbed;
  }
  if (VIDEO_EXTENSIONS.includes(fileExtension.toLowerCase())) {
    type = "video";
    return { link, type } as IVideoEmbed;
  }
  if (link.startsWith("https://taku.moe/user/")) {
    type = "profile";
    let uuid = link.match(UUID_REGEX);
    if (!uuid) return { uuid: "@unknown", type, link } as IProfileEmbed;
    return { uuid: uuid[0], type, link } as IProfileEmbed;
  }
}

/**
 * Parses a string and returns embeds for the found types
 * @param string the string to parse
 * @returns {Embed[]} an array of embeds
 * @author Geoxor
 */
export const getEmbedsFromContent = (string: string | undefined): Embed[] => {
  if (!string) return [];
  let links = string.match(/\bhttps?:\/\/\S+/gi);
  if (!links) return [];
  links = links.map(link => link.split("?")[0])
  return getEmbeds(links);
};

/**
 * Gets embeds for an array of links or undefined
 * @param links an array of links to fetch embeds for
 * @returns 
 * @author Geoxor
 */
export const getEmbeds = (links: (string | undefined)[]): Embed[] => {
  const embeds = [];
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (!link) continue;
    const embed = getEmbed(link);
    if (embed) embeds.push(embed);
  }
  return embeds;
}

/**
 * Parses the message content of a message to create embeds and anchors
 * while also sanetizing the HTML so no XSS is allowed
 * @param string the string to parse
 * @param embeds the array of embeds to remove trailing embeds with
 * @returns {string | undefined}
 * @author Geoxor
 */
export const parseMessageContent = (string: string | undefined, embeds: Embed[]) => {
  if (!string) return;
  return addTargetBlankToAnchors(processMarkdown(removeTrailingEmbeds(string, embeds))); 
}

/**
 * Parses a string to render markdown such as italics, bold, etc.
 * @param string the string to parse
 * @returns {string}
 * @author paulll
 */
export const processMarkdown = (string: string): string => {
  return md.renderInline(string);
}

/**
 * Removes trailing embeds from a string
 * @param string the string to parse
 * @param embeds the list of embeds to check against
 * @returns {string}
 * @author paulll
 */
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

/**
 * 
 * Adds the target="_blank" to anchor tags
 * @param string the string to parse
 * @returns {string}
 * @author Geoxor
 */
export const addTargetBlankToAnchors = (string: string): string =>  {
  return string.replace(/<a /gi, `<a target="_blank" `);
}
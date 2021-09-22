import { EmbedTypes, IAudioEmbed, IImageEmbed, IProfileEmbed, IVideoEmbed } from "./types";

const IMAGE_EXTENSIONS = [".jpg", ".png", ".webp", ".gif", ".jpeg"];
const AUDIO_EXTENSIONS = [".flac", ".ogg", ".aiff", ".mp3", ".wav"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".flv", ".mov"];
const UUID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g;

export const getEmbeds = (string: string | undefined): (IAudioEmbed | IImageEmbed | IVideoEmbed | IProfileEmbed)[] => {
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
      embeds.push({ uuid: uuid[0], type } as IProfileEmbed);
    }
  }

  return embeds;
};

export const renderLinks = (string: string | undefined): string | undefined => {
  if (!string) return;
  const words = string.split(" ");
  const parsed = [];

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (word.startsWith("http://") || word.startsWith("https://")) {
      word = word.split('\n')[0]; 
      parsed.push(`<a target="_blank" class="link" href="${word}"">${word}</a>`);
      continue;
    }
    parsed.push(word);
  }

  return parsed.join(' ');
}
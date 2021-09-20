import { EmbedTypes, IAudioEmbed, IImageEmbed, IVideoEmbed } from "./types";

const IMAGE_EXTENSIONS = [".jpg", ".png", ".webp", ".gif", ".jpeg"];
const AUDIO_EXTENSIONS = [".flac", ".ogg", ".aiff", ".mp3", ".wav"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", '.flv', '.mov'];

export const getEmbeds = (string: string | undefined): (IAudioEmbed | IImageEmbed | IVideoEmbed)[] => {

  if (!string) return [];

  const links = string.match(/\bhttps?:\/\/\S+/gi);
  if (!links) return [];

  const embeds = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    let type: EmbedTypes = null;
    const fileExtension = link.substring(link.lastIndexOf('.'));

    if (IMAGE_EXTENSIONS.includes(fileExtension)) {
      type = 'image'
      embeds.push({link, type} as IImageEmbed);
    };
    if (AUDIO_EXTENSIONS.includes(fileExtension)) {
      type = 'audio'
      embeds.push({link, type} as IAudioEmbed);
    };
    if (VIDEO_EXTENSIONS.includes(fileExtension)) {
      type = 'video'
      embeds.push({link, type} as IVideoEmbed);
    };
  }

  return embeds;
};
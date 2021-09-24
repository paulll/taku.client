export interface SignupForm extends LoginForm {
  email: string;
  repeatPassword: string;
}

export interface IProfileUpdate {
  banner?: File;
  avatar?: File;
}

export interface EventData<T = any> {
  eventName: string;
  body: T;
}

export type EmbedTypes = "audio" | "video" | "image" | "profile" | null;

export type Embed = (IAudioEmbed | IImageEmbed | IVideoEmbed | IProfileEmbed);

export interface IAudioEmbed {
  type: "audio";
  link: string;
}

export interface IImageEmbed {
  type: "image";
  link: string;
}

export interface IVideoEmbed {
  type: "video";
  link: string;
}

export interface IProfileEmbed {
  type: "profile";
  link: string;
  uuid: string;
}

export interface IMessage {
  _id: string;
  created_at: number;
  content?: string;
  attachments?: string[];
  channel_id: string;
  author_id: string;
}

export interface IAttachment {
  stream: ReadableStream;
  name: string;
  mime: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export type StatusTypes = "online" | "offline" | "away" | "dnd";
export type DeviceTypes = "desktop" | "mobile" | "terminal";

export interface User {
  email: string;
  password: string;
  _id: string;
  created_at: number;
  username: string;
  avatar?: string;
  banner?: string;
  last_seen: number;
  status: StatusTypes;
  device: DeviceTypes;
}

export interface AuthResponse {
  code: string;
  token?: string;
  user?: User;
}

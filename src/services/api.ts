import { LoginForm, AuthResponse, SignupForm, User, IMessage, IProfileUpdate, IEmojiMapping} from "./types";
import io from "socket.io-client";

import { useState } from "../services/state";
const state = useState();
const MOBILE_DEVICE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

class API {
  protected backendHost: string = import.meta.env.DEV ? "localhost:8081" : "backend.taku.moe";
  protected websocketProtocol: string = import.meta.env.DEV ? "ws" : "wss";
  protected httpProtocol: string = import.meta.env.DEV ? "http" : "https";
  public backendURL = `${this.httpProtocol}://${this.backendHost}`;

  protected version: string = "v1";
  public socket = io(`${this.websocketProtocol}://${this.backendHost}`, {
    auth: { 
      token: state.getToken(),
      device: MOBILE_DEVICE_REGEX.test(navigator.userAgent) ? 'mobile' : 'desktop'
    },
    transports: ["websocket"],
  });

  constructor() {
    this.socket.on("reconnect_attempt", () => console.log("Reconnecting attempt"));
    this.socket.on("connect", async () => this.socket.emit("message", "Hello server!"));
    this.socket.on("globalMessage", async (message: IMessage) => {
      await this.getUser(message.author_id);
      state.pushGlobalMessage(message);
      import.meta.env.DEV && this.log('socket', message);
    });
    this.getAllUsers();
    this.getGlobalMessages();
    this.updateEmoji();
  }

  private log(method: string, ...messages: any) {
    // prettier-ignore
    console.log(
      `%c[API]` + 
      `%c [${method.toUpperCase()}]`, 
      "color: black; background-color: #00aaff; padding: 2px; border-radius: 4px; font-weight: bold;", 
      "color: #ff00b6;", 
      ...messages
    );
  }

  private async request<T>(method: string, endpoint: string, body?: object): Promise<T> {
    const url = `${this.backendURL}/${this.version}${endpoint}`;

    // Very stupid, good job fetch API
    if (body instanceof FormData) {
      var headers = {
        Authorization: state.getToken() || "unset",
      };
    } else {
      // @ts-ignore
      var headers = {
        "Content-Type": body instanceof FormData ? undefined : "application/json",
        Authorization: state.getToken() || "unset",
      };
    }

    const options = {
      method: method.toUpperCase(),
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    };

    import.meta.env.DEV && this.log(method, url);

    const response = await fetch(url, options);
    const data = await response.json();

    return data;
  }

  public async login(form: LoginForm) {
    return this.request<AuthResponse>("post", "/login", form);
  }

  public async signup(form: SignupForm) {
    return this.request<AuthResponse>("post", "/signup", form);
  }

  public async getUser(uuid: string, force: boolean = false) {
    const cachedUser = state.getUser(uuid);
    if (!force && cachedUser) return cachedUser;
    const { user } = await this.request<{ user: User }>("get", `/user/${uuid}`);
    state.setUser(user);
    return user;
  }

  public async getAllUsers(){
    const users = await this.request<User[]>("get", `/users`);
    for (let i = 0; i < users.length; i++) {
      state.setUser(users[i]);
    }
  }

  public async sendGlobalMessage(content?: string, attachments?: File[]) {
    this.sendMessage("@global", attachments, content);
  }

  public async sendMessage(channel: string, attachments: File[] = [], content?: string) {
    if (attachments.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        formData.append('attachment', attachment);
      }
      return this.request<void>("post", `/message/${channel}`, formData);
    }
    content && content?.trim().length > 0 && this.socket.emit("globalMessage", content);
  }

  public async updateProfile(data: IProfileUpdate) {
    const formData = new FormData();
    const { avatar, banner } = data;
    avatar && formData.append("avatar", avatar);
    banner && formData.append("banner", banner);
    await this.request("patch", `/user/${state.getMe()?._id}/profile`, formData);
  }

  public async getMessages(channel_uuid: string, offset: number = 0, count: number = 25): Promise<IMessage[]> {
    const messages = (await this.request("get", `/message/${channel_uuid}/${offset}/${count}`)) as IMessage[];
    this.getUsersFromMessages(messages);
    return messages;
  }

  private async getGlobalMessages() {
    const globalMessagesFirstLoad = await this.getMessages("@global", 0, 50);
    state.setGlobalMessages(globalMessagesFirstLoad);
  }

  private async getUsersFromMessages(messages: IMessage[]) {
    for (let i = 0; i < messages.length; i++) {
      this.getUser(messages[i].author_id);
    }
  }

  private async updateEmoji() {
    // @todo request emojis.json from backend so it could handle custom emojis  
    const response = await fetch('/emoji.json');
    const emoji = await response.json() as IEmojiMapping;
    state.setEmojiMapping(emoji);
  }
}

const api = new API();

export default api;

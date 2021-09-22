import { LoginForm, AuthResponse, SignupForm, User, IMessage, IProfileUpdate } from "./types";
import io from "socket.io-client";

import { useState } from "../services/state";
const state = useState();

class API {
  protected backendHost: string = import.meta.env.DEV ? "localhost:8081" : "backend.taku.moe";
  protected websocketProtocol: string = import.meta.env.DEV ? "ws" : "wss";
  protected httpProtocol: string = import.meta.env.DEV ? "http" : "https";
  public backendURL = `${this.httpProtocol}://${this.backendHost}`;

  protected version: string = "v1";
  public socket = io(`${this.websocketProtocol}://${this.backendHost}`, {
    auth: { token: state.getToken() },
    transports: ["websocket"],
  });

  constructor() {
    this.socket.on("reconnect_attempt", () => console.log("Reconnecting attempt"));
    this.socket.on("connect", async () => this.socket.emit("message", "Hello server!"));
    this.socket.on("globalMessage", async (message: IMessage) => {
      await this.getUser(message.author_id);
      state.pushGlobalMessage(message);
    });
    this.getGlobalMessages();
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

    console.log(options);

    console.log(`API ${method.toUpperCase()} Request ${url}`);

    const response = await fetch(url, options);
    const data = await response.json();

    console.log(data);

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

  public async sendGlobalMessage(message: string) {
    if (message.trim().length > 0) {
      this.socket.emit("globalMessage", message);
    }
  }

  public async updateProfile(data: IProfileUpdate) {
    const formData = new FormData();
    const { avatar, banner } = data;
    avatar && formData.append("avatar", avatar);
    banner && formData.append("banner", banner);
    await this.request("patch", `/user/${state.getMe()?._id}/profile`, formData);
  }

  public async getMessages(channel_uuid: string, offset: number = 0, count: number = 25): Promise<IMessage[]> {
    return this.request("get", `/message/${channel_uuid}/${offset}/${count}`);
  }

  private async getGlobalMessages() {
    const globalMessagesFirstLoad = await this.getMessages("@global", 0, 50);
    state.setGlobalMessages(globalMessagesFirstLoad);

    for (let i = 0; i < globalMessagesFirstLoad.length; i++) {
      const message = globalMessagesFirstLoad[i];
      await this.getUser(message.author_id);
    }
  }
}

const api = new API();

export default api;

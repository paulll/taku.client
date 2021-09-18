import state from "./state";
import { LoginForm, AuthResponse, SignupForm, User, IAttachment, IMessage } from "./types";

class API {
  protected backendURL: string = "http://localhost:8081";
  protected version: string = "v1";

  private async request<T>(method: string, endpoint: string, body?: object): Promise<T> {
    const url = `${this.backendURL}/${this.version}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: state.getToken() || 'unset',
    };

    const options = {
      method: method.toUpperCase(),
      headers,
      body: JSON.stringify(body),
    };

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

  public async getUser(uuid: string) {
    const cachedUser = state.getUser(uuid);
    if (cachedUser) return cachedUser;
    const { user } = await this.request<{ user: User }>("get", `/user/${uuid}`);
    state.setUser(user);
    return user;
  }

  public async sendGlobalChatMessage(message: Message){
    // Websockets {...} 
  }
}


export class Attachment {
  public buffer: ReadableStream;
  public name: string;
  public mime: string;

  constructor(object: IAttachment) {
    this.buffer = object.stream;
    this.name = object.name;
    this.mime = object.mime;
  }
}

export class Message {
  public author: string;
  public content: string;
  public attachments: Attachment[];

  constructor(object: IMessage) {
    this.author = object.author;
    this.content = object.content;
    this.attachments = object.attachments;
  }
}

export class GlobalChat {
  public messages: Message[] = [];

  public getMessages(){
    return this.messages;
  }

  public setMessages(messages: Message[]){
    this.messages = messages;
  }

  public pushMessage(message: Message){
    this.messages.push(message);
  }

  public sendMessage(message: Message){
    this.pushMessage(message)
    return api.sendGlobalChatMessage(message);
  }
}

const api = new API();

export default api;

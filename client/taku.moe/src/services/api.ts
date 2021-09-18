import state from "./state";
import { LoginForm, AuthResponse, SignupForm, User, IAttachment, IMessage, EventData } from "./types";
import io from "socket.io-client";

class API {
  protected backendURL: string = "localhost:8081";
  protected version: string = "v1";
  protected socket = io(`ws://${this.backendURL}`, {'transports': ['websocket']});

  constructor(){
    this.socket.on("reconnect_attempt", () => {
      console.log("Reconnecting attempt");
    });
    this.socket.on("connect", () => {
      console.log(this.socket.id);
      this.socket.emit("message", "Hello server!");
    });
    this.socket.on("globalMessage", (message: any) => {
      // console.log(message);
      
      state.pushGlobalMessage(message);
    });
  }

  private async request<T>(method: string, endpoint: string, body?: object): Promise<T> {
    const url = `http://${this.backendURL}/${this.version}${endpoint}`;

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

  public async sendGlobalMessage(message: string) {
    this.socket.emit("globalMessage", message);
  }
}


// export class Attachment {
//   public buffer: ReadableStream;
//   public name: string;
//   public mime: string;

//   constructor(object: IAttachment) {
//     this.buffer = object.stream;
//     this.name = object.name;
//     this.mime = object.mime;
//   }
// }

// export class Message {
//   public author: string;
//   public content: string;
//   public attachments: Attachment[];

//   constructor(object: IMessage) {
//     this.author = object.author;
//     this.content = object.content;
//     this.attachments = object.attachments;
//   }
// }



const api = new API();

export default api;

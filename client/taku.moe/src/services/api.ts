import state from "./state";
import { LoginForm, AuthResponse, SignupForm, User, IMessage } from "./types";
import io from "socket.io-client";

class API {
  protected backendURL: string = "localhost:8081";
  protected version: string = "v1";
  protected socket = io(`ws://${this.backendURL}`, {
    auth: { token: state.getToken() },
    transports: ["websocket"],
  });

  constructor() {
    this.socket.on("reconnect_attempt", () => {
      console.log("Reconnecting attempt");
    });
    this.socket.on("connect", () => {
      console.log(this.socket.id);
      this.socket.emit("message", "Hello server!");
    });
    this.socket.on("globalMessage", async (message: IMessage) => {
      await api.getUser(message.author_id);
      state.pushGlobalMessage(message);
    });
  }

  private async request<T>(method: string, endpoint: string, body?: object): Promise<T> {
    const url = `http://${this.backendURL}/${this.version}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: state.getToken() || "unset",
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
    if (!uuid) return;
    const cachedUser = state.getUser(uuid);
    if (cachedUser) return cachedUser;
    const { user } = await this.request<{ user: User }>("get", `/user/${uuid}`);
    state.setUser(user);
    return user;
  }

  public async sendGlobalMessage(message: string) {
    if (message.trim().length > 0) {
      this.socket.emit("globalMessage", message);
    }
  }
}

const api = new API();

export default api;

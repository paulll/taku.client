import state from "./state";
import { LoginForm, AuthResponse, SignupForm, User } from "./types";

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
    const { user } = await this.request<{ user: User }>("get", `/user/${uuid}`);
    return user;
  }
}

export default new API();

interface SignupForm extends LoginForm {
  email: string,
  repeatPassword: string,
}

interface LoginForm {
  username: string,
  password: string,
}

export interface User {
  email: string;
  password: string;
  id: string;
  created_at: number;
  username: string;
  profileImage?: string;
  profileBanner?: string;
}

interface AuthResponse {
  code: string;
  token?: string;
  user?: User;
}

class API {
  protected backendURL: string = "http://localhost:8081";
  protected token: string = localStorage.getItem("token") || "unset";
  protected version: string = "v1";

  private async request<T>(method: string, endpoint: string, body: object): Promise<T> {
    const url = `${this.backendURL}/${this.version}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: this.token,
    }

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

  protected setToken(token: string | undefined) {
    if (token) {
      localStorage.setItem("token", token);
      this.token = token;
    }
  }

  public async login(form: LoginForm) {
    const response = await this.request<AuthResponse>("post", "/login", form);
    this.setToken(response.token)
    return response;
  }

  public async signup(form: SignupForm) {
    const response = await this.request<AuthResponse>("post", "/signup", form);
    this.setToken(response.token)
    return response;
  }
}

export default new API();
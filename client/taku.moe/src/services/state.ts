import api from "./api";
import { User } from "./types";

class State {
  public me: User | undefined;
  public token: string | "unset";
  public defaultBanner: string =
    "https://cdn.discordapp.com/attachments/881632596298170399/888473221182148608/242209754_1050478125722251_7808276400397729144_n.png";
  public defaultAvatar: string = "https://cdn.discordapp.com/emojis/455467264641335297.png?v=1";

  constructor() {
    const localStorageMe = localStorage.getItem("me");
    if (localStorageMe) this.me = JSON.parse(localStorageMe);

    this.token = localStorage.getItem("token") || "unset";
  }

  public setMe(user: User) {
    localStorage.setItem("me", JSON.stringify(user));
    this.me = user;
  }

  public async getMe(uuid: string) {
    if (this.me) return this.me;
    const user = await api.getUser(uuid);
    this.setMe(user);
    return user;
  }

  public setToken(token: string | undefined) {
    if (token) {
      localStorage.setItem("token", token);
      this.token = token;
    }
  }
}

export default new State();

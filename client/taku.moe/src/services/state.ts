import api, { User } from "./api";

class State {
  public me: User | undefined;
  public token: string | "unset";

  constructor(){
    const localStorageMe = localStorage.getItem("me")
    if (localStorageMe) this.me = JSON.parse(localStorageMe);

    this.token = localStorage.getItem("token") || "unset";
  }

  public setMe(user: User) {
    localStorage.setItem('me', JSON.stringify(user));
    this.me = user;
  }

  public async getMe(uuid: string) {
    if (this.me) return this.me
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
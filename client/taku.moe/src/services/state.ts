import { User } from "./types";
import { reactive } from "vue";
import api from "./api";

/**
 * Le abstract class that holds the attribute state
 * @author Goxer & N1kO23
 */
export abstract class Store<T extends Object> {
  protected state: T;

  public constructor(data: T) {
    this.state = reactive(data) as T;
  }
}

/**
 * State-class, extends abstract class Store.
 * Responsible for handling app's state
 * @author Goxer & N1kO23
 */
class State extends Store<IAppState> {
  public defaultBanner: string = "https://cdn.discordapp.com/attachments/881632596298170399/888473221182148608/242209754_1050478125722251_7808276400397729144_n.png";
  public defaultAvatar: string = "https://cdn.discordapp.com/emojis/455467264641335297.png?v=1";

  /**
   * Gets the me-user object
   * @returns reactive instance of me-user object
   * @author Goxer & N1kO23
   */
  public getMe() {
    return this.state.me;
  }
  /**
   * Sets the me-user object
   * @param user The instance of user object that is going to be set to me-user
   * @author Goxer & N1kO23
   */
  public setMe(user: User) {
    localStorage.setItem("me", JSON.stringify(user));
    this.state.me = user;
  }

  /**
   * Resyncs the me-user object with the backend server
   * @author Goxer & N1kO23
   */
  private async updateMe() {
    const uuid = this.state.me?._id;
    if (!uuid) return
    const user = await api.getUser(uuid);
    this.setMe(user);
  }

  /**
   * Gets the user's session token
   * @returns user's session token
   * @author Goxer & N1kO23
   */
  public getToken() {
    return this.state.token;
  }
  
  /**
   * Sets the user's session token
   * @param token new session token to be set
   * @author Goxer & N1kO23
   */
  public setToken(token: string) {
    localStorage.setItem("token", token);
    this.state.token = token;
  }

  public setUser(user: User) {
    this.state.users.set(user._id, user);
  }

  public getUser(uuid: string) {
    return this.state.users.get(uuid);
  }

  public getAllUsers(){
    return this.state.users.values();
  }

  public setLastProfile(user: User) {
    this.state.lastProfile = user;
  }

  public getLastProfile(){
    return this.state.lastProfile;
  }

  public getGlobalMessages(){
    return this.state.globalMessages;
  }

  public setGlobalMessages(messages: string[]){
    this.state.globalMessages = messages;
  }

  public pushGlobalMessage(message: string){
    this.state.globalMessages.push(message);
  }

  public sendGlobalMessage(message: string){
    this.pushGlobalMessage(message)
    return api.sendGlobalMessage(message);
  }

}

let localMe: User | string | null = localStorage.getItem('me')
if (localMe !== null) {
  localMe = JSON.parse(localMe) as User;
}

interface IAppState {
  token: string | null;
  me: User | null;
  lastProfile: User | null;
  users: Map<string, User>;
  globalMessages: string[];
}

export default new State({
  token: null,
  me: localMe,
  lastProfile: null,
  users: new Map(),
  globalMessages: [],
});

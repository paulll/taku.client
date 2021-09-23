import { IMessage, User } from "./types";
import { reactive } from "vue";

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

export class SoundEffect {
  constructor(path: string) {
    const audio = new Audio(path);
    audio.volume = 0.2;
    audio.play();
  }
}

/**
 * State-class, extends abstract class Store.
 * Responsible for handling app's state
 * @author Goxer & N1kO23
 */
class State extends Store<IAppState> {
  public defaultBanner = "https://cdn.discordapp.com/attachments/881632596298170399/890589477372825640/solid-pink-banner.png";
  public defaultAvatar = "https://cdn.discordapp.com/attachments/881632596298170399/890589155619389461/pwa-256x256.png";
  public playNotification = () => new SoundEffect("../sounds/notification.flac");
  public playKeystroke = () => new SoundEffect("../sounds/keystroke.flac");

  /**
   * Clears all data intended for logging out
   * @author Goxer
   */
  public clear() {
    localStorage.removeItem("me");
    localStorage.removeItem("token");
    this.state.me = null;
    this.state.token = null;
    this.state.lastProfile = null;
    this.state.users.clear();
    this.state.globalMessages = [];
    this.state.isEditingProfile = false;
  }

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
   * Gets the isEditingProfile attribute's value
   * @returns boolean of the editing state
   * @author Goxer & N1kO23
   */
  public getIsEditingProfile(): boolean {
    return this.state.isEditingProfile;
  }

  /**
   * Sets the isEditingProfile attribute's value
   * @param boolean new editing state
   * @author Goxer & N1kO23
   */
  public setIsEditingProfile(state: boolean) {
    this.state.isEditingProfile = state;
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
    const user = this.state.users.get(uuid);
    return user;
  }

  public getAllUsers() {
    return Array.from(this.state.users.values());
  }

  public setLastProfile(user: User) {
    this.state.lastProfile = user;
  }

  public getLastProfile() {
    return this.state.lastProfile;
  }

  public getGlobalMessages() {
    return this.state.globalMessages;
  }

  public setGlobalMessages(messages: IMessage[]) {
    this.state.globalMessages = messages;
  }

  public unshiftGlobalMessages(messages: IMessage[]) {
    this.state.globalMessages = [...this.state.globalMessages, ...messages];
  }

  public async pushGlobalMessage(message: IMessage) {
    this.playNotification();
    const messageAuthor = state.getUser(message.author_id);

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const reg = await navigator.serviceWorker.getRegistration();
      var options = {
        body: message.content || "Attachment",
        icon: messageAuthor?.avatar,
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      };
      reg?.showNotification(messageAuthor?.username || "User", options);
    }

    this.state.globalMessages.unshift(message);
  }
}

let localMe: User | string | null = localStorage.getItem("me");
if (localMe !== null) {
  localMe = JSON.parse(localMe) as User;
}

interface IAppState {
  token: string | null;
  me: User | null;
  lastProfile: User | null;
  users: Map<string, User>;
  globalMessages: IMessage[];
  isEditingProfile: boolean;
}

const state = new State({
  token: localStorage.getItem("token"),
  me: localMe,
  lastProfile: null,
  users: new Map(),
  globalMessages: [],
  isEditingProfile: false,
});

export const useState = () => state;

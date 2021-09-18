import auth from "./v1/auth";
import user from "./v1/user";
import { onMessage } from "./v1/websockets";
const handlers = [onMessage];
export const V1WSS = handlers.map(handler => ({event: handler.name.toLowerCase().substring(2), handler}));
export const V1 = [auth, user];
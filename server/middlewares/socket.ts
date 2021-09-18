import io from "socket.io";
import jwt from "jsonwebtoken";
import { IUser } from "../types";

export function socketError(){
  const error = new Error("socket.invalidAuthenticationException")
  return error
}

export function socketAuth(socket: {user?: IUser} & io.Socket , next: Function) {
  const { token } = socket.handshake.auth;
  if (!token) return next(socketError());
  const user = jwt.verify(token, process.env.JWT_SECRET!);
  if (!user) return next(socketError());
  socket.user = user as IUser;
  return next();
};

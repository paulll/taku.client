import mongoose from "mongoose";

export interface IUser extends mongoose.Document{
  id: string;
  created_at: number;
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  profileBanner?: string;
}

export interface ISignupRequest {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface ISignupResponse {
  message: string;
  user?: IUser;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  token?: string;
  user?: IUser;
}
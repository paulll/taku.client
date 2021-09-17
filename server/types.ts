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

export interface ISignupForm {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface ISignupResponse {
  code: string;
  user?: IUser;
}

export interface ILoginForm {
  username: string;
  password: string;
}

export interface ILoginResponse {
  code: string;
  token?: string;
  user?: IUser;
}
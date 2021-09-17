import express from "express";
import mongoose from "mongoose";

export interface LoggedInRequest extends express.Request {
  user?: IUser;
}

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  id: string;
  created_at: number;
  username: string;
  profileImage?: string;
  profileBanner?: string;
}

export interface ISignupForm {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface IAuthResponse {
  code: string;
  user?: IUser;
  token?: string;
}

export interface ILoginForm {
  username: string;
  password: string;
}

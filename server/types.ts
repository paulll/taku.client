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
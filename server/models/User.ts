import mongoose, { Schema } from "mongoose";

import { IUser } from "../types";

const ATLAS_HOST = `mongodb+srv://taku:${process.env.ATLAS_PASSWORD}@taku.xftvm.mongodb.net/taku?retryWrites=true&w=majority`;

mongoose.connect(ATLAS_HOST);

const schema = new Schema<IUser>(
  {
    // The user's ID
    _id: { type: String, required: true },
    // Epoch when the account is created
    created_at: { type: Number, required: true, default: Date.now() },
    // Username of the user
    username: { type: String, required: true, unique: true },
    // Email of the user
    email: { type: String, required: true },
    // Encrypted password of the user
    password: { type: String, required: true },
    // object containing the link and alpha to the pfp of the user
    profileImage: { type: String },
    // Link to the banner of the user
    profileBanner: { type: String },
  },
  {
    versionKey: false,
  }
);

export const User = mongoose.model<IUser>("User", schema);

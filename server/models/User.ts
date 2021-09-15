import mongoose, {Schema } from "mongoose";

import { IUser } from "../types";

const ATLAS_HOST = `mongodb+srv://taku:${process.env.ATLAS_PASSWORD}@taku.xftvm.mongodb.net/taku?retryWrites=true&w=majority`;

mongoose.connect(ATLAS_HOST);

const schema = new Schema<IUser>(
  {
    _id: { type: String, required: true }, // The user's ID
    created_at: { type: Number, required: true, default: Date.now() }, // Epoch when the account is created
    username: { type: String, required: true, unique: true }, // Username of the user
    email: { type: String, required: true }, // Email of the user
    password: { type: String, required: true }, // Encrypted password of the user
    profileImage: { type: String }, // object containing the link and alpha to the pfp of the user
    profileBanner: { type: String }, // Link to the banner of the user
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

// /**
//  * Attempts to update existing user and save the new data to the database
//  * @param {String} [_id] the uuid of the user
//  * @param {Object} [newProfile] newProfile object containing the new settings of the user
//  */
// schema.statics.update = async function (_id, newProfile) {
//   return new Promise(async (resolve) => {
//     const user = await this.findOne({ _id }).exec();

//     for (const [key, value] of Object.entries(newProfile)) {
//       user[key] = value;
//     }

//     if (newProfile.password) user.password = await bcrypt.hash(newProfile.password, SALT_ROUNDS);
//     user.save();
//     resolve(user);
//   });
// };

// This should be refactored to be a method instead since that makes it so we don't
// Have to query the database again for the user because we'll have it already
// Instantiated from the method's class

export const User = mongoose.model<IUser>("User", schema);
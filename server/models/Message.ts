import mongoose, { Schema } from "mongoose";

import { IMessage } from "../types";

const ATLAS_HOST = `mongodb+srv://taku:${process.env.ATLAS_PASSWORD}@taku.xftvm.mongodb.net/taku?retryWrites=true&w=majority`;

mongoose.connect(ATLAS_HOST);

const schema = new Schema<IMessage>(
  {
    // The message's ID
    _id: { type: String, required: true },
    // Epoch when the message is sent
    created_at: { type: Number, required: true, default: Date.now() },
    // The text content of the message
    content: { type: String },
    // The attachment array that contains urls to the attachments of the message
    attachments: { type: Array },
    // The id of the channel where the message was sent
    channel_id: { type: String, required: true },
    // The id of the user who sent the message
    author_id: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export const Message = mongoose.model<IMessage>("Message", schema);

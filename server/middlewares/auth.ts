import express from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { IUser, LoggedInRequest } from "../types";

export default async (req: LoggedInRequest, res: express.Response, next: express.NextFunction) => {
  if (!req.headers.authorization) return res.status(StatusCodes.FORBIDDEN).json({ code: "permission.invalid" });
  const { _id } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET!) as IUser;
  const user = await User.findOne({ _id });
  if (!user) return res.status(StatusCodes.FORBIDDEN).json({ code: "permission.invalid" });
  req.user = user;
  next();
};

import express from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { IUser, LoggedInRequest } from "../types";

export default (
  req: LoggedInRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.headers.authorization)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ code: "permission.invalid" });
  const user = jwt.verify(req.headers.authorization, process.env.JWT_SECRET!);
  if (!user)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ code: "permission.invalid" });
  req.user = user as IUser;
  next();
};

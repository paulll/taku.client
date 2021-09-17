import express from "express";
import { StatusCodes } from "http-status-codes";
import { LoggedInRequest } from "../types";

export default (
  req: LoggedInRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.params.uuid !== req.user?._id)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ code: "permission.invalid" });
  next();
};

import express from "express";
import { bad } from "../logic";
import { LoggedInRequest } from "../types";

export default (req: LoggedInRequest, res: express.Response, next: express.NextFunction) => {
  if (req.params.uuid !== req.user?._id) return bad(res, { code: "permission.invalid" });
  next();
};

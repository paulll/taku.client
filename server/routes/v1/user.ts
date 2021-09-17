
import express from "express";
import { StatusCodes } from "http-status-codes";
import { getUser } from "../../logic";
import auth from "../../middlewares/auth";
import me from "../../middlewares/auth";
import { LoggedInRequest } from "../../types";
const router = express.Router();

router.get("/user/:uuid", async (req, res) => {
  try {
    const user = await getUser(req.params.uuid);
    return res.status(StatusCodes.CREATED).json({code: "success", user});
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
});

router.patch("/user/:uuid", auth, me, async (req: LoggedInRequest, res) => {
  return res.status(StatusCodes.OK).json({code: "success"});
});

export default router;

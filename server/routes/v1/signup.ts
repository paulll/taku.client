import express from "express";
import { ISignupForm, ISignupResponse } from "../../types";
import StatusCodes from 'http-status-codes';
import { statusCodeResolver } from "../../statusHandler";
import { signup } from "../../logic";

const router = express.Router();

router.post<{}, ISignupResponse, ISignupForm>("/signup", async (req, res) => {
  try {
    const user = await signup(req.body);
    return res.status(StatusCodes.CREATED).json({code: "user.created", user});
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({ code: statusCodeResolver(error.message) });
  }
});

export default router;

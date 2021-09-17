import express from "express";
import { ISignupForm, ISignupResponse } from "../../types";
import StatusCodes from "http-status-codes";
import { statusCodeResolver } from "../../statusHandler";
import { signup } from "../../logic";
import { ILoginResponse, ILoginForm } from "../../types";
import { login } from "../../logic";

const router = express.Router();

router.post<{}, ISignupResponse, ISignupForm>("/signup", async (req, res) => {
  try {
    const user = await signup(req.body);
    return res.status(StatusCodes.CREATED).json({ code: "user.created", user });
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({ code: statusCodeResolver(error.message) });
  }
});

router.post<{}, ILoginResponse, ILoginForm>("/login", async (req, res) => {
  try {
    const loginProcess = await login(req.body);
    return res.status(StatusCodes.OK).json(loginProcess);
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
});

export default router;

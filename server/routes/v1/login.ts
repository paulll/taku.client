
import express from "express";
import { ILoginResponse, ILoginForm } from "../../types";
import StatusCodes from 'http-status-codes';
import { login } from "../../logic";
const router = express.Router();

router.post<{}, ILoginResponse, ILoginForm>("/login", async (req, res) => {
  try {
    const loginProcess = await login(req.body);
    return res.status(StatusCodes.OK).json(loginProcess);
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
});

export default router;

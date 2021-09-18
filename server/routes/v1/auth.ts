import express from "express";
import { statusCodeResolver } from "../../statusHandler";
import { bad, created, ok, signup } from "../../logic";
import { IAuthResponse, ILoginForm, ISignupForm } from "../../types";
import { login } from "../../logic";

const router = express.Router();

router.post<{}, IAuthResponse, ISignupForm>("/signup", async (req, res) => {
  try {
    const body = await signup(req.body);
    return created(res, body);
  } catch (error: any) {
    return bad(res, { code: statusCodeResolver(error.message) });
  }
});

router.post<{}, IAuthResponse, ILoginForm>("/login", async (req, res) => {
  try {
    const body = await login(req.body);
    return ok(res, body);
  } catch (error: any) {
    return bad(res, { code: statusCodeResolver(error.code) });
  }
});

export default router;

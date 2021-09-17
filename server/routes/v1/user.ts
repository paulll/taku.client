import express from "express";
import { bad, created, getUser, ok } from "../../logic";
import auth from "../../middlewares/auth";
import me from "../../middlewares/auth";
import { LoggedInRequest } from "../../types";
import { validators } from "../../validators";
const router = express.Router();

router.get("/user/:uuid", async (req, res) => {
  try {
    const user = await getUser(req.params.uuid);
    return created(res, {user});
  } catch (code: any) {
    return bad(res, { code });
  }
});

router.patch("/user/:uuid/username", auth, me, async (req: LoggedInRequest, res) => {
  const {username} = req.params;
  if (await validators.username.validateAsync(username)) {
    req.user!.username = username;
    await req.user!.save()
    return ok(res, {code: "success"});
  }

  return bad(res, {code: "username.invalid"})
});

router.patch("/user/:uuid/email", auth, me, async (req: LoggedInRequest, res) => {
  const {email} = req.params;
  if (await validators.email.validateAsync(email)) {
    req.user!.email = email;
    await req.user!.save()
    return ok(res, {code: "success"});
  }

  return bad(res, {code: "email.invalid"})
});

router.patch("/user/:uuid/password", auth, me, async (req: LoggedInRequest, res) => {
  const {password, repeatPassword} = req.params;
  if (password !== repeatPassword) return bad(res, {code: "password.mismatch"});

  const validations = await Promise.all([
    validators.password.validateAsync(password),
    validators.password.validateAsync(repeatPassword)
  ]);

  if (!validations.includes(false)) {
    req.user!.password = password;
    await req.user!.save()
    return ok(res, {code: "success"});
  }

  return bad(res, {code: "password.invalid"})
});

export default router;
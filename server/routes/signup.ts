import { Database } from "../database";
import express from "express";
import Joi from "joi";
import { ISignupForm, IUser } from "types";
const router = express.Router();

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+$]{3,30}")).required(),
  repeatPassword: Joi.ref("password"),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

interface IResponse {
  message: string;
  user?: IUser;
}

router.post<{}, IResponse, ISignupForm>("/signup", async (req, res) => {
  try {
    var form = await schema.validateAsync(req.body);
  } catch (error: any) {
    return res.status(400).json({ message: error.details[0].message });
  }


  try {
    var user = await Database.newUser(form);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }

  return res.status(201).json({message: "User created", user});
});

export default router;

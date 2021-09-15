import { Database } from "../database";
import express from "express";
import Joi from "joi";
import { ISignupRequest, ISignupResponse } from "../types";
import { validators } from "../validators";

const router = express.Router();
const validationSchema = Joi.object({repeatPassword: validators.password, ...validators});

router.post<{}, ISignupResponse, ISignupRequest>("/signup", async (req, res) => {
  try {
    var form = await validationSchema.validateAsync(req.body);
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

import { Database } from "../../database";
import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ILoginResponse, ILoginRequest } from "../../types";
import StatusCodes from 'http-status-codes';
import { validators } from "../../validators";

const router = express.Router();
const validationSchema = Joi.object({username: validators.username, password: validators.password});

router.post<{}, ILoginResponse, ILoginRequest>("/login", async (req, res) => {

  try {
    var form = await validationSchema.validateAsync(req.body);
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
  }

  try {
    var user = await Database.getUser(form.username);
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  if (!user) return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});

  const hashMatch = await bcrypt.compare(form.password, user.password);

  if (!hashMatch) {
    return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid credentials"});
  }

  const token = jwt.sign(user.toObject(), process.env.JWT_SECRET!);

  return res.status(StatusCodes.OK).json({message: "Successful login", user, token});

});

export const login = router;

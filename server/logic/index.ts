import { Database } from "../database";
import Joi from "joi";
import { validators } from "../validators";
import { ILoginForm, ISignupForm, IUser } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { statusCodeResolver } from "../statusHandler";
import { StatusCodes } from "http-status-codes";
import express from "express";

export const bad = (res: express.Response, json: object) => res.status(StatusCodes.BAD_REQUEST).json(json);
export const ok = (res: express.Response, json: object) => res.status(StatusCodes.OK).json(json);
export const created = (res: express.Response, json: object) => res.status(StatusCodes.CREATED).json(json);

const signupSchema = Joi.object({ ...validators });
const loginSchema = Joi.object({
  username: validators.username,
  password: validators.password,
});

export async function getUser(uuid: string): Promise<IUser> {
  try {
    await validators.uuid.validateAsync(uuid);
  } catch (error: any) {
    throw { code: statusCodeResolver(error.details[0].message) };
  }
  const user = await Database.getUserByUUID(uuid);
  if (!user) throw { code: "user.notFound" };
  return user;
}

export async function signup(form: ISignupForm) {
  await signupSchema.validateAsync(form);
  const user = await Database.newUser(form);
  const token = jwt.sign(user.toObject(), process.env.JWT_SECRET!);
  return { code: "signup.sucessfull", user, token };
}

export async function login(form: ILoginForm) {
  await loginSchema.validateAsync(form);

  const user = await Database.getUserByUsername(form.username);
  if (!user) throw { code: "user.notFound" };

  const hashMatch = await bcrypt.compare(form.password, user.password);
  if (!hashMatch) throw { code: "credentials.invalid" };

  const token = jwt.sign(user.toObject(), process.env.JWT_SECRET!);
  return { code: "login.valid", user, token };
}

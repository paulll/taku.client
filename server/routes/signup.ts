import { Database } from "../database";
import express from "express";
import Joi from "joi";
import { ISignupRequest, ISignupResponse } from "../types";
import { validators } from "../validators";
import StatusCodes from 'http-status-codes';


const router = express.Router();
const validationSchema = Joi.object({repeatPassword: validators.password, ...validators});

router.post<{}, ISignupResponse, ISignupRequest>("/signup", async (req, res) => {
  try {
    var form = await validationSchema.validateAsync(req.body);
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
  }

  try {
    var user = await Database.newUser(form);
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  return res.status(StatusCodes.CREATED).json({message: "User ć̶͖̤͉̹̙̖̫̱́̎͌ͅr̷̥̒̃̎̀̑̉̔̈́̚̚̚̕͘e̸̢̤͙̗̥̯͎̊͐́̂̈̔͠à̷͖͉̺̗̣̓̐̐͛̃t̶̡̟̜̞͇̟͌͊̇̒̈́̏̿̎͂̒͋̕͜͠͝ͅë̵͇̞̖́̃̓́̈̾̈͋̽̓͘͝ḋ̸̮̤͖͕̙̩͓̰͇͗̑̉̊̋̓̒̋̉͘̕͘ 🤡", user});
});

export default router;

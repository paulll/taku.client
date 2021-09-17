import { User } from "./models/User";
import { ILoginForm, ISignupForm, IUser } from "./types";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { SALT_ROUNDS } from ".";


export const Database = new class Database {

  /**
 * Attempts to create a user and save them to the database
 * @param {Object} [form] Object containing user details from the frontend form
 */
  async newUser(form: ISignupForm): Promise<IUser> {
    let {username, email} = form;
      
    const usernameQuery = await User.findOne({ username }) as IUser;
    if (usernameQuery !== null) throw { message: "username.exists" };

    // Check if email exists in DB
    const emailQuery = await User.findOne({ email }) as IUser
    if (emailQuery !== null) throw { message: "email.exists" };

    // Encrypt password
    form.password = await bcrypt.hash(form.password, SALT_ROUNDS);

    // Add user to DB
    const user = await new User({ _id: uuidv4(), ...form }).save();
    user.password = 'hidden';
    return user;
  }


  async getUser(username: string): Promise<IUser | null> {
    return User.findOne({username});
  }
}
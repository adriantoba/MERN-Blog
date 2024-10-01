import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are requiered"));
  }

  const hashPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });

  try {
    await newUser.save();
    res.json("SignUp successful");
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are requiered"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(
        errorHandler(404, "E-mail or Password incorrect. Try again!")
      );
    }
    const vlaidPassword = bcryptjs.compareSync(password, validUser.password);
    if (!vlaidPassword) {
      return next(
        errorHandler(400, "E-mail or Password incorrect. Try again!")
      );
    }
    const token = jwt.sign(
      { userId: validUser._id },
      process.env.JWT_SECRET //,{expiresIn:'1d'} -- if left blank the toke expires after the session ends (user closes the page)
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

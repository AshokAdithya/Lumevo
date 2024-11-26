import bcrypt from "bcrypt";
import User from "../models/User.js";
import { validatePassword, validateEmail } from "../utils/ValidateJoi.js";
import Token from "../models/Token.js";
import Mailer from "../utils/Mailer.js";
import crypto from "crypto";

//Password Reset Link Generation
export const passwordResetLink = async (req, res) => {
  try {
    const { error } = validateEmail(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(409)
        .send({ message: "User with given email does not exist!" });
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}`;

    await Mailer(user.email, "Password Reset", url);
    res
      .status(200)
      .send({ message: "password reset link sent to your email account" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//Verifying Password Reset Url
export const resetUrlCheck = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "Invalid Link" });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send({ message: "Invalid Link" });
    }
    res.status(200).send({ message: "Valid Url" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//Password Reset

export const passwordReset = async (req, res) => {
  try {
    const { error } = validatePassword(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "Invalid Link" });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    if (!user.verified) {
      user.verified = true;
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashPassword;
    await user.save();
    await token.deleteOne();

    return res.status(200).send({ message: "password Reset Successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

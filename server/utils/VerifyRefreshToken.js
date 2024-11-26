import Token from "../models/Token.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

const verifyRefreshToken = async (refreshToken) => {
  const privateKey = process.env.JWTREFRESHKEY;

  try {
    const doc = await Token.findOne({ token: refreshToken });
    if (!doc) {
      throw { error: true, message: "Invalid refresh token" };
    }

    const tokenDetails = jwt.verify(refreshToken, privateKey);
    return {
      tokenDetails,
      message: "Valid refresh token",
    };
  } catch (err) {
    throw { message: err.message || "Invalid refresh token" };
  }
};

export default verifyRefreshToken;

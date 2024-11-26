import jwt from "jsonwebtoken";
import Token from "../models/Token.js";

const GenerateToken = async (user) => {
  try {
    const payload = { _id: user._id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWTPRIVATEKEY, {
      expiresIn: "14m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWTREFRESHKEY, {
      expiresIn: "5d",
    });

    const userToken = await Token.findOne({ userId: user._id });
    if (userToken) {
      await userToken.deleteOne();
    }

    await new Token({ userId: user._id, token: refreshToken }).save();
    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

export default GenerateToken;

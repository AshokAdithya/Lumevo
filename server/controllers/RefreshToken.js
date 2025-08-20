import { validateRefreshTokenScheme } from "../utils/ValidateJoi.js";
import jwt from "jsonwebtoken";
import verifyRefreshToken from "../utils/VerifyRefreshToken.js";

export const newAccessToken = async (req, res) => {
  try {
    // const { error } = validateRefreshTokenScheme(req.body);
    // if (error) {
    //   return res
    //     .status(400)
    //     .json({ error: true, message: error.details[0].message });
    // }

    const refreshToken = req.cookies.refreshToken;

    const { tokenDetails } = await verifyRefreshToken(refreshToken);
    const payload = { _id: tokenDetails._id, role: tokenDetails.role };
    const accessToken = jwt.sign(payload, process.env.JWTPRIVATEKEY, {
      expiresIn: "14m",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 14 * 60 * 1000,
    });

    res.status(200).send({
      message: "Access token created successfully",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

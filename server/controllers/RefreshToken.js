import { validateRefreshTokenScheme } from "../utils/ValidateJoi.js";
import jwt from "jsonwebtoken";
import verifyRefreshToken from "../utils/VerifyRefreshToken.js";

export const newAccessToken = async (req, res) => {
  try {
    const { error } = validateRefreshTokenScheme(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    const { tokenDetails } = await verifyRefreshToken(req.body.refreshToken);
    const payload = { _id: tokenDetails._id, role: tokenDetails.role };
    const access = jwt.sign(payload, process.env.JWTPRIVATEKEY, {
      expiresIn: "14m",
    });

    res.status(200).send({
      access,
      message: "Access token created successfully",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  const accessToken = req.params.token;

  if (!accessToken)
    return res
      .status(403)
      .send({ success: false, message: "Access Denied: No token provided" });
  try {
    const tokenDetails = jwt.verify(accessToken, process.env.JWTPRIVATEKEY);
    req.user = tokenDetails;
    next();
  } catch (err) {
    res
      .status(403)
      .send({ success: false, message: "Access Denied: Invalid token" });
  }
};

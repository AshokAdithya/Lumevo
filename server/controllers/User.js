import User from "../models/User.js";
import Profile from "../models/Profile.js";

export const adminUserCheck = async (req, res) => {
  if (req.user && req.user.role) {
    const user = await User.findById(req.user._id);

    const userProfile = await Profile.findOne({ user: user._id });

    if (req.user.role.includes("expert")) {
      res.status(200).send({
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: userProfile,
        },
        success: true,
        message: "Expert authenticated.",
      });
    } else if (req.user.role.includes("admin")) {
      res.status(200).send({
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: userProfile,
        },
        success: true,
        message: "Admin authenticated.",
      });
    } else {
      res.status(200).send({
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: userProfile,
        },
        success: true,
        message: "Student authenticated.",
      });
    }
  } else {
    res.status(403).send({ success: false, message: "You are not authorized" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profileId = req.params.profileId;

    const { firstName, lastName } = req.body;

    const studentProfile = await Profile.findByIdAndUpdate(profileId, {
      firstName: firstName,
      lastName: lastName,
    });
    return res.status(200).send({ message: "Profile Updated Successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

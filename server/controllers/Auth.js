import bcrypt from "bcrypt";
import User from "../models/User.js";
import generator from "generate-password";
import {
  validateUser,
  validateSignIn,
  validateProfile,
  validateRefreshTokenScheme,
  validateExpertRequests,
} from "../utils/ValidateJoi.js";
import Profile from "../models/Profile.js";
import Token from "../models/Token.js";
import Mailer from "../utils/Mailer.js";
import crypto from "crypto";
import GenerateToken from "../utils/GenerateToken.js";
import axios from "axios";
import ExpertRequests from "../models/ExpertRequests.js";

//Sign Up functionality
export const signUp = async (req, res) => {
  try {
    const userData = {
      email: req.body.email,
      password: req.body.password,
    };

    const profileData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    };

    // Validate user data
    const { error: userError } = validateUser(userData);
    if (userError) {
      return res.status(400).send({ message: userError.details[0].message });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: "User with given email already exists" });
    }

    const existingProfile = await Profile.findOne({
      email: req.body.email,
    });
    if (existingProfile) {
      return res
        .status(409)
        .send({ message: "User with give phone number already exsits" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create and save the user
    const newUser = await new User({
      email: req.body.email,
      password: hashPassword,
    }).save();

    // Add user ID to profile data and validate
    profileData.user = newUser._id.toString();
    const { error: profileError } = validateProfile(profileData);
    if (profileError) {
      return res.status(400).send({ message: profileError.details[0].message });
    }

    // Create and save the profile linked to the user
    const profile = await new Profile(profileData).save();

    await User.findByIdAndUpdate(newUser._id, {
      profile: profile._id.toString(),
    });

    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;

    await Mailer(newUser.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

//Sign In functionalities
export const signIn = async (req, res) => {
  try {
    const { error } = validateSignIn(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    if (!user.password && user.isGoogleAuth) {
      return res
        .status(400)
        .send({ message: "Please use Google login to sign in." });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;

        await Mailer(user.email, "Verify Email", url);
      }
      return res
        .status(400)
        .send({ message: "An email is sent to your account please verify" });
    }
    const userProfile = await Profile.findOne({ user: user._id });

    const { accessToken, refreshToken } = await GenerateToken(user);

    // res.status(200).send({
    //   access: accessToken,
    //   refresh: refreshToken,
    //   user: {
    //     id: user._id,
    //     email: user.email,
    //     role: user.role,
    //     profile: userProfile,
    //   },
    //   message: "Logged in successfully",
    // });

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: true, //process.env.NODE_ENV === "production",
    //   sameSite: "Strict",
    //   maxAge: 14 * 60 * 1000,
    // });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "Strict",
    //   maxAge: 5 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 14 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.status(200).send({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: userProfile,
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//Google-Auth
export const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
    );
    const data = response.data;

    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      if (!existingUser.verified) {
        await User.findByIdAndUpdate(existingUser._id, { verified: true });
      }

      if (!existingUser.isGoogleAuth) {
        await User.findByIdAndUpdate(existingUser._id, {
          isGoogleAuth: true,
          googleId: data.id,
        });
      }
      const userProfile = await Profile.findOne({ user: existingUser._id });

      const { accessToken, refreshToken } = await GenerateToken(existingUser);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 14 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).send({
        user: {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
          profile: userProfile,
        },
        message: "Logged in Successfully",
      });
    } else {
      const profileData = {
        firstName: data.given_name,
        lastName: data.family_name,
        email: data.email,
        user: null,
      };

      const newUser = await new User({
        email: data.email,
        isGoogleAuth: true,
        googleId: data.id,
        verified: true,
      }).save();

      profileData.user = newUser._id.toString();

      const { error: profileError } = validateProfile(profileData);

      if (profileError) {
        return res
          .status(400)
          .send({ message: profileError.details[0].message });
      }

      try {
        const userProfile = await new Profile(profileData).save();

        await User.findByIdAndUpdate(newUser._id, {
          profile: userProfile._id.toString(),
        });

        const { accessToken, refreshToken } = await GenerateToken(newUser);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 14 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 5 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).send({
          user: {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            profile: userProfile,
          },
          message: "Logged in Successfully",
        });
      } catch (profileSaveError) {
        console.error("Error saving profile:", profileSaveError);
        await User.findByIdAndDelete(newUser._id);
        return res.status(500).send({ message: "Error creating profile." });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

//Verify Email
export const verify = async (req, res) => {
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

    await User.updateOne({ _id: user._id }, { $set: { verified: true } });
    await token.deleteOne();

    return res.status(200).send({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    // const { error } = validateRefreshTokenScheme(req.body);
    // if (error)
    //   return res.status(400).json({ message: error.details[0].message });

    const user_id = req.user._id;

    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(0),
      path: "/",
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(0),
      path: "/",
    });

    await Token.deleteMany({ userId: user_id });
    res.status(200).send({ message: "Logged Out Sucessfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//expert-request
export const expertRequests = async (req, res) => {
  try {
    const requestExpert = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
    };
    const { error } = validateExpertRequests(requestExpert);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await ExpertRequests.findOne({ email: requestExpert.email });

    if (user) {
      res.status(401).send({ message: "User with Given email already exists" });
    }

    const expertUser = await new ExpertRequests(requestExpert).save();

    const message =
      "Reqest sent to the Admin. Wait for the Expert Account Creation.";

    await Mailer(expertUser.email, "Thanks For contacting Us", message);

    res.status(201).send({ message: "Request Sent Successfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getExpertRequest = async (req, res) => {
  try {
    const requests = await ExpertRequests.find().sort({ createdAt: 1 });
    if (!requests) {
      return res
        .status(200)
        .send({ success: true, message: "No requests Found" });
    }
    return res.status(200).send({ success: true, data: requests });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const adminCreateExpert = async (req, res) => {
  try {
    const requestExpert = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
    };
    const { error } = validateExpertRequests(requestExpert);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: requestExpert.email });

    if (user) {
      await Mailer(
        requestExpert.email,
        "Conflict in Email",
        "Account with given email already exists. Please Fill another form"
      );
      return res
        .status(401)
        .send({ message: "User with Given email already exists" });
    }

    const password = generator.generate({
      length: 10,
      numbers: true,
    });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    const userData = {
      email: requestExpert.email,
      password: hashPassword,
      verified: true,
      role: ["expert"],
    };

    const profileData = {
      email: requestExpert.email,
      firstName: requestExpert.firstName,
      lastName: requestExpert.lastName,
      user: null,
    };

    const newExpert = await new User(userData).save();

    profileData.user = newExpert._id.toString();

    const userProfile = await new Profile(profileData).save();

    const userDetails = {
      email: newExpert.email,
      password: password,
    };

    await ExpertRequests.findOneAndUpdate(
      { email: req.body.email },
      { status: "approved" }
    );
    const message = `
      Your Account Details:
      email: ${userDetails.email}
      password: ${userDetails.password}
    `;

    await Mailer(
      newExpert.email,
      "Your Expert Request has been Confirmed",
      message
    );

    res.status(201).send({ message: "Expert account created successfully." });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const adminRejectExpert = async (req, res) => {
  try {
    const email = req.params.email;

    const expert = await ExpertRequests.findOne({ email });
    if (!expert) {
      return res.status(404).send({ message: "No User found" });
    }

    expert.status = "rejected";
    await expert.save();

    await User.findOneAndDelete({ email });
    await Profile.findOneAndDelete({ email });

    const message = `
    You are not eligible for our specific requirements
    `;

    await Mailer(expert.email, "Thanks for Approaching Us", message);
    return res.status(200).send({ message: "Expert Rejected Successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

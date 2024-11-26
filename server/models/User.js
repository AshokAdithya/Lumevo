// user.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isGoogleAuth: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: [String],
      enum: ["student", "expert", "admin"],
      default: ["student"],
    },
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

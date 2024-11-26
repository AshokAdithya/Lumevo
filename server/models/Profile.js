import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
    },
    portfolioLink: [
      {
        fileName: { type: String },
        fileId: { type: mongoose.Schema.Types.ObjectId },
        contentType: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);

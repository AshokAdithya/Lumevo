import mongoose from "mongoose";

const StudentApply = new mongoose.Schema({
  type: { type: String, required: true },
  template: {
    fileName: { type: String },
    fileId: { type: mongoose.Schema.Types.ObjectId },
    contentType: { type: String },
  },
  additionalFiles: [
    {
      fileName: { type: String },
      fileId: { type: mongoose.Schema.Types.ObjectId },
      contentType: { type: String },
    },
  ],
  status: {
    type: String,
    required: true,
    enum: ["completed", "pending"],
    default: "pending",
  },
  completedFile: {
    fileName: { type: String },
    fileId: { type: mongoose.Schema.Types.ObjectId },
    contentType: { type: String },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  paymentStatus: {
    type: String,
    enum: ["completed", "pending"],
    default: "pending",
    required: true,
  },
  orderId: {
    type: String,
    default: "",
  },
  paymentDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("StudentApply", StudentApply);

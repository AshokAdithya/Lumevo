import mongoose from "mongoose";

const DocumentTypesSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  files: {
    fileName: String,
    fileId: mongoose.Schema.Types.ObjectId,
    contentType: String,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("DocumentTypes", DocumentTypesSchema);

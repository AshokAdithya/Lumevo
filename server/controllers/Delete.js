import StudentApply from "../models/StudentApply.js";
import Profile from "../models/Profile.js";
import mongoose from "mongoose";
import { ObjectId, GridFSBucket } from "mongodb";
import { getGfsBucket } from "../utils/gridfs.js";

export const deletePortfolioFile = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const profile = await Profile.findOne({ "portfolioLink.fileId": fileId });

    if (!profile) {
      return res.status(404).send({ message: "File not found in profile." });
    }

    profile.portfolioLink = profile.portfolioLink.filter(
      (file) => file.fileId.toString() !== fileId
    );

    await profile.save();

    const gfsBucket = getGfsBucket();

    const fileObjectId = new mongoose.Types.ObjectId(fileId);
    await gfsBucket.delete(fileObjectId);

    res.status(200).send({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting portfolio file:", error);
    res
      .status(500)
      .send({ message: "Error deleting file", error: error.message });
  }
};

export const deleteStudentFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const fileObjectId = new ObjectId(fileId);
    const studentUpload = await StudentApply.findOne({
      $or: [
        { "template.fileId": fileId },
        { "additionalFiles.fileId": fileId },
      ],
    });

    if (!studentUpload) {
      return res.status(404).send({ message: "File not found" });
    }

    if (
      studentUpload.template.fileId &&
      studentUpload.template.fileId.toString() === fileId
    ) {
      studentUpload.template = undefined;
    } else {
      studentUpload.additionalFiles = studentUpload.additionalFiles.filter(
        (file) => !file.fileId.toString() === fileId
      );
    }

    await studentUpload.save();

    const gfsBucket = getGfsBucket();

    gfsBucket.delete(new mongoose.Types.ObjectId(fileObjectId));

    res.status(200).send({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting student file:", error);
    res
      .status(500)
      .send({ message: "Error deleting file", error: error.message });
  }
};

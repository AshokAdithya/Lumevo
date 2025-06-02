import DocumentTypes from "../models/DocumentTypes.js";
import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import StudentApply from "../models/StudentApply.js";
import Profile from "../models/Profile.js";
import { getGfsBucket } from "../utils/gridfs.js";

const conn = mongoose.connection;

export const downloadFiles = async (req, res) => {
  try {
    const type = req.params.type;

    const document = await DocumentTypes.findOne({ type });

    if (!document) {
      return res
        .status(404)
        .send({ message: `No templates found for type '${type}'` });
    }

    const files = document.files;

    const fileExists = await conn.db
      .collection("uploads.files")
      .findOne({ _id: files.fileId });

    if (!fileExists) {
      return res.status(404).send({
        message: `File not exists`,
      });
    }

    const bucket = getGfsBucket();

    const downloadStream = bucket.openDownloadStream(files.fileId);
    res.set({
      "Content-Type": files.contentType,
      "Content-Disposition": `attachment; filename=${files.fileName}`,
    });
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error downloading templates:", error);
    res
      .status(500)
      .send({ message: "Error downloading templates", error: error.message });
  }
};

export const downloadStudentFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const studentUpload = await StudentApply.findOne({
      $or: [
        { "template.fileId": fileId },
        { "additionalFiles.fileId": fileId },
        { "completedFile.fileId": fileId },
      ],
    }).select("template additionalFiles completedFile");

    if (!studentUpload) {
      return res.status(404).send({ message: "File not found" });
    }

    let fileDetails;

    if (
      studentUpload.template.fileId &&
      studentUpload.template.fileId.toString() === fileId
    ) {
      fileDetails = studentUpload.template;
    } else if (
      studentUpload.completedFile &&
      studentUpload.completedFile.fileId.toString() === fileId
    ) {
      fileDetails = studentUpload.completedFile;
    } else if (studentUpload.additionalFiles.length !== 0) {
      fileDetails = studentUpload.additionalFiles.find(
        (file) => file.fileId.toString() === fileId
      );
    }

    if (!fileDetails) {
      return res.status(404).send({ message: "File details not found" });
    }

    const fileExists = await conn.db
      .collection("uploads.files")
      .findOne({ _id: fileDetails.fileId });

    if (!fileExists) {
      return res.status(404).send({
        message: `File not exists`,
      });
    }

    const bucket = getGfsBucket();

    const downloadStream = bucket.openDownloadStream(fileDetails.fileId);

    res.set({
      "Content-Type": fileDetails.contentType,
      "Content-Disposition": `attachment; filename=${fileDetails.fileName}`,
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error downloading student file:", error);
    res
      .status(500)
      .send({ message: "Error downloading file", error: error.message });
  }
};

export const downloadUserFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const profileId = req.params.profileId;

    let fileDetails;

    if (!fileId || !profileId) {
      return res.status(404).send({ message: "Profile or File not Found" });
    }

    const profileDetails = await Profile.findById(profileId);

    if (profileDetails.portfolioLink.length !== 0) {
      fileDetails = profileDetails.portfolioLink.find(
        (file) => file.fileId.toString() === fileId
      );
    }

    if (!fileDetails) {
      return res.status(404).send({ message: "File details not found" });
    }

    const fileExists = await conn.db
      .collection("uploads.files")
      .findOne({ _id: fileDetails.fileId });

    if (!fileExists) {
      return res.status(404).send({
        message: `File not exists`,
      });
    }

    const bucket = getGfsBucket();

    const downloadStream = bucket.openDownloadStream(fileDetails.fileId);

    res.set({
      "Content-Type": fileDetails.contentType,
      "Content-Disposition": `attachment; filename=${fileDetails.fileName}`,
    });

    downloadStream.pipe(res);
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

import DocumentTypes from "../models/DocumentTypes.js";
import StudentApply from "../models/StudentApply.js";
import mongoose from "mongoose";
import { ObjectId, GridFSBucket } from "mongodb";
import Mailer from "../utils/Mailer.js";
import Profile from "../models/Profile.js";
import { getGfsBucket } from "../utils/gridfs.js";

// const conn = mongoose.connection;
// let gfsBucket;
// conn.once("open", () => {
//   gfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
// });

export const uploadTemplates = async (req, res) => {
  try {
    const file = req.file;
    const { type, description, image, price } = req.body;
    if (!file) {
      return res
        .status(400)
        .send({ message: "At least one file (file or image) is required" });
    }

    const fileDetails = {
      fileName: file.originalname,
      fileId: file.id,
      contentType: file.contentType,
    };

    const uploads = await new DocumentTypes({
      type: type,
      files: fileDetails,
      image: image,
      price: price,
      description: description,
    }).save();

    res.status(200).send({ message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Error uploading files:", error);
    res
      .status(500)
      .send({ message: "Error uploading files", error: error.message });
  }
};

export const updateUploadedTemplates = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, price, image } = req.body;
    const file = req.file;

    if (!id) {
      return res.status(400).send({ message: "Document ID is required" });
    }

    const document = await DocumentTypes.findById(id);

    if (!document) {
      return res.status(404).send({ message: "Document not found" });
    }

    document.type = type || document.type;
    document.description = description || document.description;
    document.price = price || document.price;
    document.image = image || document.image;

    if (file) {
      const fileExists = await conn.db
        .collection("uploads.files")
        .findOne({ _id: file.fileId });

      if (!fileExists) {
        return res.status(404).send({
          message: `File not exists`,
        });
      }
      if (document.files && document.files.fileId) {
        const gfsBucket = getGfsBucket();
        gfsBucket.delete(
          new mongoose.Types.ObjectId(document.files.fileId),
          (err) => {
            if (err) {
              console.error("Error deleting old file:", err);
            }
          }
        );
      }

      const fileDetails = {
        fileName: file.originalname,
        fileId: file.id,
        contentType: file.mimetype,
      };

      document.files = fileDetails;
    }

    await document.save();

    res
      .status(200)
      .send({ message: "Document updated successfully", document });
  } catch (error) {
    console.error("Error updating document:", error);
    res
      .status(500)
      .send({ message: "Error updating document", error: error.message });
  }
};
export const studentUpload = async (req, res) => {
  const userId = req.user._id;
  const { type, fileType } = req.body;

  const file = req.file;

  if (!userId || !type || !file || file.length === 0) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  const fileDetails = {
    fileName: file.originalname,
    fileId: file.id,
    contentType: file.contentType,
  };

  try {
    const studentFile = await StudentApply.findOne({ userId, type }).sort({
      createdAt: -1,
    });

    if (!studentFile || studentFile.status == "completed") {
      if (fileType === "template") {
        const newEntry = await new StudentApply({
          type: type,
          template: fileDetails,
          additionalFiles: [],
          userId: userId,
        }).save();

        return res.status(201).send({ message: "File Uploaded Successfully" });
      } else {
        const newEntry = await new StudentApply({
          type: type,
          template: {},
          additionalFiles: [fileDetails],
          userId: userId,
        }).save();

        return res.status(201).send({ message: "File Uploaded Successfully" });
      }
    } else {
      if (fileType === "template") {
        const oldFileId = studentFile.template.fileId;
        if (oldFileId) {
          const gfsBucket = getGfsBucket();
          gfsBucket.delete(new mongoose.Types.ObjectId(oldFileId), (err) => {
            if (err) {
              return res
                .status(500)
                .send({ message: "Error deleting old file" });
            }
          });
        }

        studentFile.template = fileDetails;
      } else {
        studentFile.additionalFiles.push(fileDetails);
      }
      await studentFile.save();

      res.status(201).json({ message: "File Uploaded Successfully" });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getUploads = async (req, res) => {
  try {
    const { type } = req.body;

    const studentFile = await StudentApply.findOne({ userId, type }).sort({
      createdAt: -1,
    });

    if (!studentFile || studentFile.status == "completed") {
      return res.status(200).send({
        applyId: null,
        paymentStatus: null,
        dbuploadedTemplate: null,
        dbadditionalFiles: [],
      });
    }

    const { _id, paymentStatus, template, additionalFiles } = studentFile;

    res.status(200).send({
      applyId: _id,
      paymentStatus: paymentStatus,
      dbuploadedTemplate: template,
      dbadditionalFiles: additionalFiles,
    });
  } catch (err) {
    res.status(500).send({ message: "Error Getting Files" });
  }
};

export const getUpdateUploads = async (req, res) => {
  try {
    const orderId = req.query.orderId;

    const studentFile = await StudentApply.findById(orderId);

    if (!studentFile) {
      return res.status(400).send({
        dbuploadedTemplate: null,
        dbadditionalFiles: [],
      });
    }

    const { template, additionalFiles } = studentFile;

    res.status(200).send({
      dbuploadedTemplate: template,
      dbadditionalFiles: additionalFiles,
    });
  } catch (err) {
    res.status(500).send({ message: "Error Getting Files" });
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

export const getOrders = async (req, res) => {
  try {
    const userId = req.query.userId;

    const data = await StudentApply.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    res.status(200).send(data);
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const all_orders = await StudentApply.find({ paymentStatus: "completed" })
      .sort({ paymentDate: -1 })
      .populate({
        path: "userId",
        populate: {
          path: "profile",
          select: "firstName lastName email",
        },
      });

    const transformedData = all_orders.map((item) => ({
      _id: item._id,
      type: item.type,
      userId: item.userId._id,
      status: item.status,
      paymentStatus: item.paymentStatus,
      paymentDate: item.paymentDate,
      createdAt: item.createdAt,
      template: item.template,
      additionalFiles: item.additionalFiles,
      completedFile: item.completedFile || {},
      user: {
        name: `${item.userId.profile.firstName} ${item.userId.profile.lastName}`,
        email: item.userId.email,
      },
    }));

    return res.status(200).send(transformedData);
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getExpertOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const order = await StudentApply.findById(orderId)
      .sort({ paymentData: 1 })
      .populate({
        path: "userId",
        populate: {
          path: "profile",
          select: "firstName lastName email",
        },
      });

    if (!order) {
      return res.status(400).send({ message: "Bad Order Id" });
    }
    const transformedData = {
      _id: order._id,
      type: order.type,
      status: order.status,
      userId: order.userId._id,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      template: order.template,
      additionalFiles: order.additionalFiles,
      completedFile: order.completedFile || {},
      user: {
        name: `${order.userId.profile.firstName} ${order.userId.profile.lastName}`,
        email: order.userId.email,
      },
    };

    return res.status(200).send(transformedData);
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const expertUpload = async (req, res) => {
  const { orderId } = req.body;

  const file = req.file;

  if (!orderId || !file) {
    return res.status(400).send({ success: false, message: "Client Error" });
  }

  const fileDetails = {
    fileName: file.originalname,
    fileId: file.id,
    contentType: file.contentType,
  };
  try {
    const studentFile = await StudentApply.findById(orderId);

    if (!studentFile) {
      return res.status(404).send({ success: false, message: "Bad Order Id" });
    }

    if (studentFile.completedFile.fileId) {
      const gfsBucket = getGfsBucket();
      gfsBucket.delete(
        new mongoose.Types.ObjectId(studentFile.completedFile.fileId),
        (err) => {
          if (err) {
            return res.status(500).send({ message: "Error deleting old file" });
          }
        }
      );
    }

    studentFile.completedFile = fileDetails;
    studentFile.status = "completed";
    await studentFile.save();

    const user = await Profile.findOne({ user: studentFile.userId });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    console.log(user.email, studentFile.type, user.firstName);

    const email = user.email;
    const subject = `${studentFile.type} Completion Confirmation`;
    const text = `Dear ${user.firstName},\n\nYour ${studentFile.type} with Order ID ${orderId} has been successfully completed.\n\nYou can download your completed ${studentFile.type} from the Lumevo website `;

    await Mailer(email, subject, text);

    return res
      .status(200)
      .send({ success: true, message: "File Uploaded Successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};

export const getCompletedOrders = async (req, res) => {
  try {
    const userId = req.query.userId;

    const data = await StudentApply.find({
      userId: userId,
      status: "completed",
    }).sort({ createdAt: -1 });

    if (!data) {
      return res.status(200), send({ data: [], message: "No files found" });
    }
    res.status(200).send(data);
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await DocumentTypes.find();
    if (!documents || documents.length === 0) {
      return res.status(200).send({ message: "No files found" });
    }

    return res.status(200).send(documents);
  } catch (err) {
    console.error("Error fetching documents:", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getSpecificDocument = async (req, res) => {
  try {
    const type = req.params.type;
    const document = await DocumentTypes.findOne({ type });

    return res.status(200).send(document);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const uploadUserFile = async (req, res) => {
  try {
    const { profileId } = req.body;
    const file = req.file;

    if (!file || !profileId) {
      return res.status(404).send({ message: "Profile or File not Found" });
    }

    const fileDetails = {
      fileName: file.originalname,
      fileId: file.id,
      contentType: file.contentType,
    };

    const profileDetails = await Profile.findById(profileId);

    if (!profileDetails) {
      return res.status(404).send({ message: "Profile not Found" });
    }

    profileDetails.portfolioLink.push(fileDetails);
    await profileDetails.save();

    return res
      .status(200)
      .send({ message: "File Uploaded successfully", file: fileDetails });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getUserFiles = async (req, res) => {
  const profileId = req.params.profileId;

  if (!profileId) {
    return res.status(404).send({ message: "Profile not Found" });
  }

  const profileDetails = await Profile.findById(profileId);

  let portfolioLinks = [];

  if (profileDetails.portfolioLink.length > 0) {
    portfolioLinks = profileDetails.portfolioLink;
  }

  res.status(200).send({ userFiles: portfolioLinks });
};

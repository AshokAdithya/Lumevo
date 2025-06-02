import DocumentTypes from "../models/DocumentTypes.js";
import StudentApply from "../models/StudentApply.js";
import mongoose from "mongoose";
import { ObjectId, GridFSBucket } from "mongodb";
import Profile from "../models/Profile.js";
import { exec, spawn } from "child_process";
import axios from "axios";

const conn = mongoose.connection;
let gfsBucket;
conn.once("open", () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

export const getUploads = async (req, res) => {
  try {
    const userId = req.user._id;
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

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;

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
    const { page, limit, filters } = req.body;

    const filterQuery = {};
    if (filters.type && filters.type !== "all") {
      filterQuery.type = filters.type;
    }

    if (filters.orderStatus && filters.orderStatus !== "all") {
      filterQuery.status = filters.orderStatus;
    }

    if (filters.search) {
      filterQuery.$or = [
        {
          "userId.profile.firstName": { $regex: filters.search, $options: "i" },
        },
        {
          "userId.profile.lastName": { $regex: filters.search, $options: "i" },
        },
        { "userId.profile.email": { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.date) {
      filterQuery.paymentDate = { $gte: new Date(filters.date) };
    }

    const skip = (page - 1) * limit;

    const all_orders = await StudentApply.find({
      paymentStatus: "completed",
      ...filterQuery,
    })
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        populate: {
          path: "profile",
          select: "firstName lastName email",
        },
      });

    const totalOrders = await StudentApply.countDocuments({
      paymentStatus: "completed",
      ...filterQuery,
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

    return res.status(200).send({
      orders: transformedData,
      total: totalOrders,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getSpecificOrdersCount = async (req, res) => {
  try {
    const result = await StudentApply.aggregate([
      {
        $match: { paymentStatus: "completed" },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const count = result.reduce((acc, item) => acc + item.count, 0);

    result.push({ type: "All", count });

    const countDict = result.reduce((dict, item) => {
      dict[item.type] = item.count;
      return dict;
    }, {});

    return res.status(200).send(countDict);
  } catch (err) {
    console.error(err);
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

export const getCompletedOrders = async (req, res) => {
  try {
    const userId = req.user._id;

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

export const getAllTypes = async (req, res) => {
  try {
    const response = await DocumentTypes.find();
    const titles = response.map((type) => type.type);
    res.status(200).send(titles);
  } catch (error) {
    console.error("Error fetching document types:", error);
    res.status(500).send({ message: "Error fetching document types" });
  }
};

export const getRankings = async (req, res) => {
  try {
    const { country_name, course } = req.body;
    const result = await axios.post("http://localhost:8000/", {
      country_name: country_name,
      course: course,
    });

    res.status(200).send(result.data.list);
  } catch (err) {
    res.status(500).send({ message: "Error Fetching data" });
  }
};

export const getCCOptions = async (req, res) => {
  try {
    const result = await axios.get(
      "http://localhost:8000/get-countries-courses"
    );
    res.status(200).send({
      countriesList: result.data.countries_list,
      coursesList: result.data.course_list,
    });
  } catch (err) {
    res.status(500).send({ message: "Error Fetching data" });
  }
};

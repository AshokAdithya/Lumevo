// gridfs.js
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

const conn = mongoose.connection;
let gfsBucket;

conn.once("open", () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

export const getGfsBucket = () => {
  if (!gfsBucket) {
    throw new Error("GridFS bucket is not initialized");
  }
  return gfsBucket;
};

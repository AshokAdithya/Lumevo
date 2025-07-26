import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import authRoutes from "./routes/auth.js";
import passwordResetRoutes from "./routes/passwordReset.js";
import refreshTokenRoutes from "./routes/refreshToken.js";
import userRoutes from "./routes/user.js";
import uploadRoutes from "./routes/upload.js";
import downloadRoutes from "./routes/download.js";
import Grid from "gridfs-stream";
import paymentRoute from "./routes/payment.js";
import chatRoute from "./routes/chat.js";
import Messages from "./models/Messages.js";
import getRoute from "./routes/get.js";
import deleteRoute from "./routes/delete.js";
import csurf from "csurf";
import helmet from "helmet";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: true, // set true if using HTTPS
    sameSite: "lax",
  },
});
app.use(csrfProtection);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(helmet());

io.on("connection", (socket) => {
  // console.log(`User Connected : ${socket.id}`);

  socket.on("disconnect", () => {
    // console.log(`User Disconnected: ${socket.id}`);
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    // console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    const { roomId, userId, message } = data;

    if (!roomId || !userId || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    try {
      const chat = await Messages({
        roomId: roomId,
        userId: userId,
        message: message,
      }).save();

      socket.to(roomId).emit("receive_message", { roomId, userId, message });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });
});

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Define routes
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).json({ message: "Invalid CSRF Token" });
  } else {
    next(err);
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/refresh-token", refreshTokenRoutes);
app.use("/api/user", userRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/chats", chatRoute);
app.use("/api/get", getRoute);
app.use("/api/delete", deleteRoute);

// Connect to MongoDB
const connect = async () => {
  mongoose.connect(process.env.MONGO);

  mongoose.connection.on("connected", () => {
    console.log("Databse connected successfully");
  });

  mongoose.connection.on("error", (error) => {
    console.log("error while connecting to database : " + error);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Database Disconnected");
  });
};

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("GridFS initialized");
});

server.listen(process.env.PORT, () => {
  connect();
  console.log(`Server Started on port ${process.env.port}`);
});

// import dotenv from "dotenv";
// import express from "express";
// import session from "express-session";
// import { Server } from "socket.io";
// import cors from "cors";
// import mongoose from "mongoose";
// import authRoutes from "./routes/auth.js";
// import passwordResetRoutes from "./routes/passwordReset.js";
// import refreshTokenRoutes from "./routes/refreshToken.js";
// import userRoutes from "./routes/user.js";
// import uploadRoutes from "./routes/upload.js";
// import downloadRoutes from "./routes/download.js";
// import Grid from "gridfs-stream";
// import paymentRoute from "./routes/payment.js";
// dotenv.config();

// const app = express();

// app.use(cors());

// app.use(express.json());

// app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
// app.use(cors());

// const io = new Server(app, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// app.use("/api/auth", authRoutes);

// app.use("/api/password-reset", passwordResetRoutes);

// app.use("/api/refresh-token", refreshTokenRoutes);

// app.use("/api/user", userRoutes);

// app.use("/api/uploads", uploadRoutes);

// app.use("/api/downloads", downloadRoutes);

// app.use("/api/payment", paymentRoute);

// const connect = async () => {
//   mongoose.connect(process.env.MONGO);

//   mongoose.connection.on("connected", () => {
//     console.log("Databse connected successfully");
//   });

//   mongoose.connection.on("error", (error) => {
//     console.log("error while connecting to database : " + error);
//   });

//   mongoose.connection.on("disconnected", () => {
//     console.log("Database Disconnected");
//   });
// };

// const conn = mongoose.connection;
// let gfs;

// conn.once("open", () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("uploads");
//   console.log("GridFS initialized");
// });

// app.listen(8080, () => {
//   connect();
//   console.log("Server Started");
// });

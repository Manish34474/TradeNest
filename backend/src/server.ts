// imports
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// custom imports
import connectDB from "./config/dbConn.config";
import credentials from "./middlewares/credentials.middleware";
import { corsOption } from "./config/corsOption.config";

// router imports
import usersRouter from "./routes/users.route";
import authRouter from "./routes/auth.route";
import categoryRouter from "./routes/category.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import orderRoute from "./routes/order.route";

// dotenv configuration
dotenv.config();

// port
const PORT = process.env.PORT || 5000;

//app
const app = express();

// database connection
connectDB();

// cors options
app.use(credentials);
app.use(cors(corsOption));

// cookie parser
app.use(cookieParser());

// url incoded
app.use(express.urlencoded({ extended: true }));

// built in middleware for json
app.use(express.json({ limit: "5mb" }));

// Serve Static Files
app.use("/public", express.static(path.join(__dirname, "../public")));
console.log("serving file from: ", path.join(__dirname, "../public"));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRoute);

//server
mongoose.connection.once("open", () => {
  console.log("Connected to Mongo DB");
  app.listen(PORT, () => {
    console.log("Server running on port number : ", PORT);
  });
});

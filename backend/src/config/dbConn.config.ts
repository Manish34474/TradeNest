import dotenv from "dotenv";
dotenv.config();

import mongoose, { ConnectOptions } from "mongoose";

const clientOptions: ConnectOptions = {
  serverApi: {
    version: "1" as const,
    strict: true,
  },
  dbName: "tradenest",
};

const mongoURI = process.env.DATABASE_URL || "";

export default async function connectDB() {
  try {
    await mongoose.connect(mongoURI, clientOptions);
  } catch (err) {
    console.log("Oops!! Error occured during database connection", err);
  }
}

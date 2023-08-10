import mongoose from "mongoose";
import { dbConfig, dbEndpoint } from "../config/db.config.js";

export class Database {
  static async connect() {
    try {
      await mongoose.connect(dbEndpoint, dbConfig);
      console.log("Database connected");
    } catch (error) {
      console.log("Database connection error", error);
    }
  }
} 
import mongoose from "mongoose";
import { dbConfig, dbEndpoint } from "../config/db.config.js";

export class Database {
  db;
  async connect() {
    try {
      await mongoose.connect(dbEndpoint, dbConfig);
      this.db = mongoose.connection;
      console.log("Database connected");
    } catch (error) {
      console.log("Database connection error", error);
    }
  }
  insertOne(document, collectionName) {
    this.db.collection(collectionName).insertOne(document, (err, res) => {
      if (err) throw err;
      console.log("1 document inserted");
    });
  }
}

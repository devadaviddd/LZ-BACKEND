import mongoose from "mongoose";
import { dbConfig, dbEndpoint } from "../config/db.config.js";
import { ObjectId } from "mongodb";
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
  async insertOneRecord(document, collectionName) {
    try {
      const result = await this.db.collection(collectionName).insertOne(document);
      return result;
    } catch (error) {
      console.log("error", error);
    }
  }
  async findExistedRecord(id, collectionName) {
    console.log('id', id);
    console.log('collectionName', collectionName);
    try {
      const record =  await this.db.collection(collectionName).findOne({ _id: new ObjectId(id) });
      console.log('record', record);
      return record;
    } catch (error) {
      console.log('error', error);
    }
  }
}

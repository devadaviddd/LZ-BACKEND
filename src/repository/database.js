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
  async insertRecord(document, collectionName) {
    try {
      const result = await this.db
        .collection(collectionName)
        .insertOne(document);
      return result;
    } catch (error) {
      console.log("error", error);
    }
  }

  async deleteOneRecord(filter, collectionName) {
    try {
      const result = await this.db
        .collection(collectionName)
        .deleteOne(filter);
      return result;
    } catch (error) {
      console.log("error", error);
    }
  }
  
  async getRecordById(id, collectionName) {
    try {
      const record = await this.db
        .collection(collectionName)
        .findOne({ _id: new ObjectId(id) });
      return record;
    } catch (error) {
      console.log("error", error);
    }
  }
  async getRecordsByQuery(query, collectionName) {
    try {
      const records = await this.db
        .collection(collectionName)
        .find(query)
        .toArray();
      return records;
    } catch (error) {
      console.log("error", error);
    }
  }
  async updateRecordById(id, updateFields, collectionName) {
    try {
      const result = await this.db
        .collection(collectionName)
        .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
      return result;
    } catch (error) {
      console.log("error", error);
    }
  }
}

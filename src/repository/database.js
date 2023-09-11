import mongoose from "mongoose";
import { dbConfig, dbEndpoint } from "../config/db.config.js";
import { ObjectId } from "mongodb";
export class Database {
  #db;
  async connect() {
    try {
      await mongoose.connect(dbEndpoint, dbConfig);
      this.#db = mongoose.connection;
    } catch (error) {
      throw Error("Database connection error");
    }
  }
  async insertRecord(document, collectionName) {
    try {
      const result = await this.#db
        .collection(collectionName)
        .insertOne(document);
      return result;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getRecordById(id, collectionName) {
    try {
      const record = await this.#db
        .collection(collectionName)
        .findOne({ _id: new ObjectId(id) });
      return record;
    } catch (error) {
      throw Error(error.message);
    }
  }
  async getRecordsByQuery(query, collectionName) {
    try {
      const records = await this.#db
        .collection(collectionName)
        .find(query)
        .toArray();
      return records;
    } catch (error) {
      throw Error(error.message);
    }
  }
  async updateRecordById(id, updateFields, collectionName) {
    try {
      const result = await this.#db
        .collection(collectionName)
        .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
      return result;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async updateOneRecordByQuery(query, updatePipeline, collectionName) {
    try {
      const result = await this.#db.collection(collectionName).updateOne(
        query,
        updatePipeline
      )
      return result;
    } catch (error) {
      throw Error(error.message);
    }
  }
  async updateManyRecordsByQuery(query, updatePipeline, collectionName) {
    try {
      const result = await this.#db
        .collection(collectionName)
        .updateMany(query, updatePipeline, {
          multi: true,
        });
      return result;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteRecordById(id, collectionName) {
    try {
      const result = await this.#db
        .collection(collectionName)
        .deleteOne({ _id: new ObjectId(id) });
      return result;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteRecordsByQuery(query, collectionName) {
    try {
      const result = await this.#db
        .collection(collectionName)
        .deleteMany(query);
      return result;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async modifyRecordById(id, updateList, collectionName) {
    try {
      const result = await this.#db
        .collection(collectionName)
        .updateOne({ _id: new ObjectId(id) }, {
          $mod: updateList
        });
      return result;
    } catch (error) {
      throw Error(error.message);
    }
  }
}

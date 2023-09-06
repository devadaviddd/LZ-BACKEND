import mongoose from "mongoose";
import { database } from "../di/index.js";
import { SellerMapper } from "../repository/Mapper/mapper.js";
const ObjectId = mongoose.Types.ObjectId;

export class Seller {
  #sellerModel;
  constructor(sellerSchema, dto) {
    this.#sellerModel = SellerMapper.mapToSchema(sellerSchema, dto);
  }
  async insertSellerToDatabase(userId) {
    try {
      if (userId) {
        this.#sellerModel._id = new ObjectId(userId);
      }
      await this.#sellerModel.save();
      console.log("seller created");
      this._id = this.#sellerModel._id;
      this.name = this.#sellerModel.name;
      this.email = this.#sellerModel.email;
      this.password = this.#sellerModel.password;
      this.status = this.#sellerModel.status;
      this.product = this.#sellerModel.product;
      this.order = this.#sellerModel.order;
      this.businessName = this.#sellerModel.businessName;
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(sellerId, database) {
    const sellerRecord = await database.getRecordById(sellerId, "sellers");
    return {
      _id: sellerRecord._id,
      name: sellerRecord.name,
      email: sellerRecord.email,
      businessName: sellerRecord.businessName,
      phone: sellerRecord.phone,
      status: sellerRecord.status,
    };
  }

  static async getAllSellers(database) {
    const sellerRecords = await database.getRecordsByQuery({}, "sellers");
    return sellerRecords;
  }

  static async getAllProductsSeller(sellerID) {
    const productRecords = await database.getRecordsByQuery({}, "products");
    return productRecords;
  }

}

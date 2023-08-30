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
      this.avatar = this.#sellerModel.avatar;
      this.status = this.#sellerModel.status;
      this.product = this.#sellerModel.product;
      this.order = this.#sellerModel.order;
      this.businessName = this.#sellerModel.businessName;
    } catch (error) {
      throw error;
    }
  }

  static async getAllSellers() {
    const sellerRecords = await database.getRecordsByQuery({}, "sellers");
    return sellerRecords;
  }

  static async getAllProductsSeller(sellerID) {
    const productRecords = await database.getRecordsByQuery({}, "products");
    return productRecords;
  }
}

import mongoose from "mongoose";
import { SellerMapper } from "../repository/Mapper/mapper.js";
const ObjectId = mongoose.Types.ObjectId;

export class Seller {
  #seller;
  constructor(sellerSchema, dto) {
    this.#seller = SellerMapper.mapToSchema(sellerSchema, dto);
    this._id = this.#seller._id;
    this.name = this.#seller.name;
    this.email = this.#seller.email;
    this.password = this.#seller.password;
    this.status = this.#seller.status;
    this.product = this.#seller.product;
    this.businessName = this.#seller.businessName;
    this.phone = this.#seller.phone;
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

  static async updateSeller(sellerId, updatedFields, database) {
    await database.updateRecordById(sellerId, updatedFields, "sellers");
    const updatedSeller = await database.getRecordById(sellerId, "sellers");
    console.log("updatedSeller", updatedSeller);
    return updatedSeller;
  }
}

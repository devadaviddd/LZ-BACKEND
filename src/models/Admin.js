import mongoose from "mongoose";
import { AdminMapper } from "../repository/Mapper/mapper.js";
import { SELLER_STATUS } from "../constants/index.js";
import { User } from "./User.js";
const ObjectId = mongoose.Types.ObjectId;

export class Admin {
  #adminModel;
  constructor(adminSchema, dto) {
    this.#adminModel = AdminMapper.mapToSchema(adminSchema, dto);
  }

  async insertAdminToDatabase(userId) {
    try {
      if (userId) {
        this.#adminModel._id = new ObjectId(userId);
      }
      await this.#adminModel.save();
      console.log("Admin created");
      this._id = this.#adminModel._id;
      this.name = this.#adminModel.name;
      this.email = this.#adminModel.email;
      this.password = this.#adminModel.password;
      this.categories = this.#adminModel.categories;
      this.phone = this.#adminModel.phone;
    } catch (error) {
      throw error;
    }
  }

  static async getAdminEmailsByIds(adminId, database) {
    const adminRecord = await User.findUserById(adminId, database);
    console.log("adminId", adminId);
    console.log("adminRecord", adminRecord);
    return adminRecord.email;
  }

  static async getProfile(adminId, database) {
    const adminRecord = await database.getRecordById(adminId, "admins");
    return {
      _id: adminRecord._id,
      name: adminRecord.name,
      email: adminRecord.email,
      phone: adminRecord.phone,
    };
  }

  static async rejectSeller(sellerId, database) {
    const seller = await database.updateRecordById(
      sellerId,
      { status: SELLER_STATUS.REJECTED },
      "sellers"
    );
    return seller;
  }

  static async approveSeller(sellerId, database) {
    const seller = await database.updateRecordById(
      sellerId,
      { status: SELLER_STATUS.APPROVED },
      "sellers"
    );
    return seller;
  }
}

import mongoose from "mongoose";
import { AdminMapper } from "../repository/Mapper/mapper.js";
import { SELLER_STATUS } from "../constants/index.js";
import { User } from "./User.js";

export class Admin {
  #admin;
  constructor(adminSchema, dto) {
    this.#admin = AdminMapper.mapToSchema(adminSchema, dto);
    this._id = this.#admin._id;
    this.name = this.#admin.name;
    this.email = this.#admin.email;
    this.password = this.#admin.password;
    this.categories = this.#admin.categories;
    this.phone = this.#admin.phone;
  }

  static async getAdminEmailsByIds(adminId, database) {
    const adminRecord = await User.findUserById(adminId, database);
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

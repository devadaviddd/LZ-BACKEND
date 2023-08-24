import mongoose from "mongoose";
import { AdminMapper } from "../repository/Mapper/mapper.js";
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
      this.avatar = this.#adminModel.avatar;
      this.categories = this.#adminModel.categories;
    } catch (error) {
      throw error;
    }
  }

  static async getAdminNamesByIds(adminId) {
    const adminRecord = await User.findUserById(adminId);
    return adminRecord.name;
  }

  static async getAdminEmailsByIds(adminId) {
    const adminRecord = await User.findUserById(adminId);
    return adminRecord.email;
  }
}

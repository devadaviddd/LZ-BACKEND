import mongoose from "mongoose";
import { AdminMapper } from "../data/Mapper/mapper.js";
import { User } from "./User.js";

export class Admin extends User {
  #adminModel;
  constructor(AdminSchema, dto) {
    const { name, email, password } = dto;
    super({
      name,
      email,
      password,
    });
    this.#adminModel = AdminMapper.mapToModel(AdminSchema, dto);
  }
  
  async createAdmin() {
    try {
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
}

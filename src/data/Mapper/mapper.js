import mongoose from "mongoose";

export class AdminMapper {
  static mapToModel (schema, dto) {
    mongoose.model("Admin", schema);
    const AdminModel = mongoose.model("Admin");
    const admin = new AdminModel({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      avatar: dto.avatar,
      categories: dto.categories,
    });
    return admin;  
  }
}
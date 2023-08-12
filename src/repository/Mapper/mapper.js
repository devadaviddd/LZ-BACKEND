import mongoose from "mongoose";

export class AdminMapper {
  static mapToSchema (schema, dto) {
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

export class UserMapper {
  static mapToSchema (schema, dto) {
    mongoose.model("User", schema);
    const UserModel = mongoose.model("User");
    const user = new UserModel({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      avatar: dto.avatar,
      role: dto.role,
    });
    return user;  
  }
}
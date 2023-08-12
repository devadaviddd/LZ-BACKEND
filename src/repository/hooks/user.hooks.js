import { ROLE } from "../../constants/role.js";
import { database } from "../../di/index.js";
import { Admin } from "../../models/Admin.js";
import { AdminMapper } from "../Mapper/mapper.js";
import { adminSchema } from "../Schemas/admin.schema.js";
import bcrypt from "bcrypt";

export async function beforeInsertToUsers(next) {
  console.log("before insert to users");
  console.log(this);
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log("hash successfully");
    next();
  } catch (error) {
    console.log("is error");
    next(error);
  }
}
export async function afterInsertToUsers(doc, next) {
  console.log("after insert to users");
  console.log(doc);
  try {
    const { _id, name, email, password, role } = doc;

    switch (role) {
      case ROLE.ADMIN:
        const admin = AdminMapper.mapToSchema(adminSchema, doc);
        console.log("admin", admin);
        await database.insertOneRecord({
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          password: admin.password,
          categories: admin.categories,
          avatar: admin.avatar,
        }, "admins");
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

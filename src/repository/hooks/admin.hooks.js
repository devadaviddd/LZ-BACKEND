import bcrypt from "bcrypt";
import { User } from "../../models/user.js";
import { userSchema } from "../Schemas/user.schema.js";
import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";

export async function beforeInsertToAdmins(next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
}

export async function afterInsertToAdmins(doc, next) {
  const { _id, name, email, password, phone } = doc;
  try {
    await database.insertRecord(
      { _id, name, email, password, phone, role: ROLE.ADMIN },
      "users"
    );
    next();
  } catch (error) {
    next(error);
  }
}

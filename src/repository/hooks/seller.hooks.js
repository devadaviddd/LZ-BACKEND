import bcrypt from "bcrypt";
import { User } from "../../models/User.js";
import { userSchema } from "../Schemas/user.schema.js";
import { ROLE } from "../../constants/role.js";
import { database } from "../../di/index.js";

export async function beforeInsertToSellers(next) {
  console.log("before insert to sellers");
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log("hash successfully");
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function afterInsertToSellers(doc, next) {
  const { _id, name, email, password } = doc;
  try {
    await database.insertRecord(
      { _id, name, email, password, role: ROLE.SELLER },
      "users"
    );
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}
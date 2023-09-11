import bcrypt from "bcrypt";
import { User } from "../../models/User.js";
import { database } from "../../di/index.js";

export async function beforeInsertToCustomers(next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
}

export async function afterInsertToCustomers(doc, next) {
  const { _id, name, email, password, phone } = doc;
  try {
    await database.insertRecord(
      { _id, name, email, password, phone, role: ROLE.CUSTOMER },
      "users"
    );

    next();
  } catch (error) {
    next(error);
  }
}

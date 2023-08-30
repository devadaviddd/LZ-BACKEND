import bcrypt from "bcrypt";
import { User } from "../../models/User.js";

export async function beforeInsertToCustomers(next) {
  console.log("before insert to customers");
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

export async function afterInsertToCustomers(doc, next) {
  const { _id, name, email, password, phone } = doc;
  try {
    await database.insertRecord(
      { _id, name, email, password, phone, role: ROLE.CUSTOMER },
      "users"
    );
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

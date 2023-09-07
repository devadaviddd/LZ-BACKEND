import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Admin } from "../../models/Admin.js";
import { Customer } from "../../models/Customer.js";
import { Seller } from "../../models/Seller.js";
import { adminSchema } from "../Schemas/admin.schema.js";
import { customerSchema } from "../Schemas/customer.schema.js";
import { sellerSchema } from "../Schemas/seller.schema.js";

import bcrypt from "bcrypt";

export async function beforeInsertToUsers(next) {
  console.log("before insert to users");
  try {
    const salt = await bcrypt.genSalt();
    console.log("password", this.password);
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
  try {
    const { role } = doc;
    switch (role) {
      case ROLE.ADMIN:
        // const admin = AdminMapper.mapToSchema(adminSchema, doc);
        const admin = new Admin(adminSchema, doc);
        await database.insertRecord(
          {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            password: admin.password,
            categories: admin.categories,
            phone: admin.phone,
          },
          "admins"
        );
        break;
      case ROLE.SELLER:
        // const seller = SellerMapper.mapToSchema(sellerSchema, doc);
        const seller = new Seller(sellerSchema, doc);  
        await database.insertRecord(
          {
            _id: seller._id,
            name: seller.name,
            email: seller.email,
            password: seller.password,
            status: seller.status,
            product: seller.product,
            order: seller.order,
            businessName: seller.businessName,
            phone: seller.phone,
          },
          "sellers"
        );
        break;
      case ROLE.CUSTOMER:
        const customer = new Customer(customerSchema, doc);
        // const customer = CustomerMapper.mapToSchema(customerSchema, doc);
        await database.insertRecord(
          {
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            password: customer.password,
            phone: customer.phone,
            address: customer.address,
          },
          "customers"
        );
        break;
      default:
        break;
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}


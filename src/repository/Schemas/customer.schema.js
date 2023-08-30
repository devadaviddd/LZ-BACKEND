import mongoose from "mongoose";
import { isName } from "../../utils/regex/isName.js";
import { isEmail } from "../../utils/regex/isEmail.js";
import { isPhone } from "../../utils/regex/isPhone.js";
import { isPassword } from "../../utils/regex/isPassword.js";
import {
  afterInsertToCustomers,
  beforeInsertToCustomers,
} from "../hooks/customer.hooks.js";

export const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    validate: {
      validator: isName,
      message: "Name cannot over 20 characters and contain special characters",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: isEmail,
      message: "Email is invalid",
    },
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    unique: true,
    validate: {
      validator: isPhone,
      message: "Phone is invalid",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: isPassword,
      message:
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    },
  },
  address: {
    type: String,
    require: [true, "Address is required"],
  },
});

customerSchema.pre("save", beforeInsertToCustomers);
customerSchema.post("save", afterInsertToCustomers);

import mongoose from "mongoose";
import { isName } from "../../utils/regex/isName.js";
import { isEmail } from "../../utils/regex/isEmail.js";
import { isPassword } from "../../utils/regex/isPassword.js";
import { isPhone } from "../../utils/regex/isPhone.js";
import {
  afterInsertToAdmins,
  beforeInsertToAdmins,
} from "../hooks/admin.hooks.js";

export const adminSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: isPassword,
      message:
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    },
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
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
});
adminSchema.pre("save", beforeInsertToAdmins);
adminSchema.post("save", afterInsertToAdmins);

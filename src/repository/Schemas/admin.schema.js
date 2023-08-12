import mongoose from "mongoose";
import { isName } from "../../utils/regex/isName.js";
import { isEmail } from "../../utils/regex/isEmail.js";
import { isPassword } from "../../utils/regex/isPassword.js";
import { afterInsertToAdmins, beforeInsertToAdmins } from "../hooks/admin.hooks.js";

export const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    validate: {
      validator: isName,
      message: "Name cannot over 20 characters and contain special characters",
    }
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: isEmail,

      message: "Email is invalid",
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  avatar: {
    type: String,
    default: '',
  }, 
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  }
})
adminSchema.pre("save", beforeInsertToAdmins);
adminSchema.post("save", afterInsertToAdmins);
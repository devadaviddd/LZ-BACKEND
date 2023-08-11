import mongoose from "mongoose";
import { isName } from "../../utils/regex/isName.js";
import { isEmail } from "../../utils/regex/isEmail.js";
import { isPassword } from "../../utils/regex/isPassword.js";

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
    minlength: [6, "Password cannot less than 6 characters"],
    maxlength: [16, "Password cannot over 16 characters"],
    validate: {
      validator: isPassword,
      message: "Password is invalid should contain a special character",
    }
  },
  avatar: {
    type: String,
    default: '',
  }, 
  categories: {
    type: [String],
    default: [],
  }
})
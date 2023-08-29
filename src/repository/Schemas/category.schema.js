import mongoose from "mongoose";
import { afterUpdateToCategory } from "../hooks/category.hooks.js";
import { isName } from "../../utils/regex/isName.js";

export const categorySchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  admins: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  subCategories: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

categorySchema.post("findOneAndUpdate", afterUpdateToCategory);

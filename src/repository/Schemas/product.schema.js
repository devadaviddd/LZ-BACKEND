import mongoose from "mongoose";
import { PRODUCT_STATUS } from "../../constants/index.js";

export const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    validate: {
      validator: function (price) {
        return price >= 0;
      },
      message: "Price must be greater than or equal to 0",
    },
  }, 
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  image: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    default: 0,
    validate: {
      validator: function (quantity) {
        return quantity >= 0;
      },
      message: "Quantity must be greater than or equal to 0",
    },
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    validate: {
      validator: function (categories) {
        return categories.length > 0;
      },
      message: "Categories array must have at least one element",
    },
    require: [true, "Categories is required"],
  },
  status: {
    type: String,
    enum: PRODUCT_STATUS,
    default: PRODUCT_STATUS.NEW,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Created by is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

import mongoose from "mongoose";
import { beforeDeleteToProducts } from "../hooks/product.hooks.js";

export const productSchema = new mongoose.Schema(
  {
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
    stock: {
      type: Number,
      default: 0,
      validate: {
        validator: function (quantity) {
          return quantity >= 0;
        },
        message: "Stock must be greater than or equal to 0",
      },
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Created by is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    strictPopulate: false,
  }
);


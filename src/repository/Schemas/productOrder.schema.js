import mongoose from "mongoose";
import { PRODUCT_STATUS } from "../../utils/constants.js";

export const productOrderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Product id is required"],
  },
  quantity: {
    type: Number,
    default: 1,
    validate: {
      validator: function (quantity) {
        return quantity >= 1;
      },
      message: "Quantity must be greater than or equal to 1",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    validate: {
      validator: function (price) {
        return price >= 0;
      },
    },
    message: "Price must be greater than or equal to 0",
  },
  status: {
    type: String,
    enum: PRODUCT_STATUS,
    default: PRODUCT_STATUS.NEW,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Order id is required"],
  }
});

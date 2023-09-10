import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({

  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Cart id is required"],
  },
  cart: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          validate: {
            validator: function (quantity) {
              return quantity >= 0;
            },
            message: "Quantity must be greater than or equal to 0",
          },
        },
      },
    ],
    default: [],
  },
});

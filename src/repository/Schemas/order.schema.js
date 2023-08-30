import mongoose from "mongoose";


export const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Customer id is required"],
  },
  productOrders: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

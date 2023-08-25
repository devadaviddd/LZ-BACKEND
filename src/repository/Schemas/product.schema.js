import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    validate: {
        validator: function(price) {
            return price >= 0;
        },
        message: "Price must be greater than or equal to 0",
    }
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  avatar: {
    type: String,
    default: '',
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    validate: {
        validator: function(categories) {
          return categories.length > 0;
        },
        message: 'Categories array must have at least one element'
      },
  }
});
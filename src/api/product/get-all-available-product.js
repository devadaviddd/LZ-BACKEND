import { database } from "../../di/index.js";
import { Product } from "../../models/product.js";

export const getAllAvailableProductsAPI = async (req, res) => {
  try {
    const products = await Product.getAllAvailableProducts(database);
    const count = products.length;
    return res.status(200).json({
      message: "Get all available products successfully",
      count,
      products,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

import { database } from "../../di/index.js";
import { Product } from "../../models/product.js";

export const getProductByCategoryIdAPI = async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    return res.status(400).json({
      message: "Category id is required",
    });
  }

  try {
    const products = await Product.getProductByCategoryId(categoryId, database);
    const count = products.length;
    return res.status(200).json({
      message: "Get products by category id successfully",
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

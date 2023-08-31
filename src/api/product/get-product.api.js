import { Product } from "../../models/Product.js";

export const getProductAPI = async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({
      message: "Product id is required",
    });
  }

  try {
    const product = await Product.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json({
      message: "Get product by id successfully",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

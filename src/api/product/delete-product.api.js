import { ROLE } from "../../constants/index.js";
import { Product } from "../../models/Product.js";
import { productSchema } from "../../repository/Schemas/product.schema.js";

export const deleteProductAPI = async (req, res) => {
  const authUser = req.authUser;
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "Product id is required",
    });
  }

  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to delete product",
    });
  }

  const { _id: sellerId, role } = authUser;
  if (role !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to delete product",
    });
  }

  try {
    const existedProductRecord = await Product.getProductById(id);
    if (!existedProductRecord) {
      return res.status(404).json({
        message: "Product not found to delete",
      });
    }
    const product = new Product(productSchema, existedProductRecord);
    console.log("product.id", product._id);
    console.log("existed.id", existedProductRecord._id);
  
    
    const isDeleteSuccess = await product.deleteProduct(id);
    console.log("isDeleteSuccess", isDeleteSuccess);
    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

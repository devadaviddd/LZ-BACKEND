import { ROLE } from "../../constants/index.js";
import { Product } from "../../models/Product.js";

export const getSellerProductsAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get seller products",
    });
  }
  const { _id: sellerId, role } = authUser;
  if (role !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to get seller products",
    });
  }

  try {
    const productsOfSeller = await Product.getProductBySellerId(sellerId);
    const count = productsOfSeller.length;

    return res.status(200).json({
      message: "Get seller products successfully",
      count,
      productsOfSeller,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

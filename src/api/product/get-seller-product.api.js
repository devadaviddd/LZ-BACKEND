import { Product } from '../../models/Product.js';

export const getAllProductsLatestAPI = async (req, res) => {
    const authUser = req.authUser;
    if (!authUser) {
      return res.status(401).json({
        message: "You are unauthorized to get all product",
      });
    }
    const { role } = authUser;
    if (role !== ROLE.ADMIN) {
      return res.status(403).json({
        message: "You don't have permission to get all seller",
      });
    }
    try {
      const productList = await Product.getAllProductsLatest();
      const count = productList.length;
      return res.status(200).json({
        message: "Get all product successfully",
        count,
        productList,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
}
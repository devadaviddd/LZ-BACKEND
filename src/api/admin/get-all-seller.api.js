import { ROLE } from "../../constants/index.js";
import { Seller } from "../../models/Seller.js";

export const getAllSellerAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get all seller",
    });
  }
  const { role } = authUser;
  if (role !== ROLE.ADMIN) {
    return res.status(403).json({
      message: "You don't have permission to get all seller",
    });
  }
  try {
    const sellers = await Seller.getAllSellers();
    const count = sellers.length;
    return res.status(200).json({
      message: "Get all seller successfully",
      count,
      sellers,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

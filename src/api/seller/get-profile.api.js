import { ROLE } from "../../constants/index.js";
import { Seller } from "../../models/Seller.js";

export const getSellerProfileAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get admin",
    });
  }

  const { role, _id } = authUser;
  console.log("id", _id);
  if (role !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to get seller",
    });
  }

  try {
    const seller = await Seller.getProfile(_id);
    if (!seller) {
      return res.status(404).json({
        message: "seller not found",
      });
    }
    return res.status(200).json({
      message: "Get seller successfully",
      seller,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Cart } from "../../models/cart.js";

export const getCartAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get cart",
    });
  }

  const { _id: customerId, role } = authUser;
  if (role !== ROLE.CUSTOMER) {
    return res.status(403).json({
      message: "You don't have permission to get cart",
    });
  }

  try {
    const cart = await Cart.getCartByCustomerId(customerId, database);
    return res.status(200).json({
      message: "Cart get successfully",
      cart,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

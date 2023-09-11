import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Cart } from "../../models/Cart.js";

export const deleteCartAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to delete cart",
    });
  }

  const { _id: customerId, role } = authUser;

  if (role !== ROLE.CUSTOMER) {
    return res.status(403).json({
      message: "You don't have permission to delete cart",
    });
  }

  const existedCart = await database.getRecordById(customerId, "carts");
  if (!existedCart) {
    return res.status(400).json({
      message: "Cart not found to delete",
    });
  }

  try {
    await Cart.deleteCartAPI(customerId, database);
    return res.status(200).json({
      message: "Cart deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }

}
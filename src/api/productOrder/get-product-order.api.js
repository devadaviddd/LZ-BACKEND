import { ROLE } from "../../constants";
import { ProductOrder } from "../../models/ProductOrder";

export const getProductOrderAPI = async (req, res) => {
  const authUser = req.authUser;
  const id = req.params.id;

  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get product order",
    });
  }

  if (!id) {
    return res.status(400).json({
      message: "Id is required",
    });
  }

  const { role } = authUser;
  if (role !== ROLE.CUSTOMER && role !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to get product order",
    });
  }

  try {
    const productOrder = await ProductOrder.getProductOrder(id);
    return res.status(200).json({
      message: "Get product order successfully",
      productOrder,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

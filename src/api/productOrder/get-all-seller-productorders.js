import { ProductOrder } from "../../models/productOrder.js";
import { productOrderSchema } from "../../repository/Schemas/productOrder.schema.js";
import { ROLE } from "../../constants/index.js";

export const getAllSellerProductOrders = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to filter product order by seller",
    });
  }

  const { role: isAuthRole, _id: sellerId } = authUser;
  if (isAuthRole !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to filter product order by seller",
    });
  }

  if (!sellerId) {
    return res.status(400).json({
      message: "SellerId is required",
    });
  }

  try {
    const productOrderInstance = new ProductOrder(productOrderSchema, {});
    const productOrderOfSeller =
      await productOrderInstance.getProductOrdersBySeller(sellerId);

    return res.status(200).json({
      message: "Filter product order by seller successfully",
      sellerId: sellerId,
      productOrderOfSeller,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

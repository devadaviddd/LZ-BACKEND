import { ProductOrder } from "../../models/ProductOrder.js";
import { productOrderSchema } from "../../repository/Schemas/productOrder.schema.js";
import { ROLE } from "../../constants/index.js";

export const filterProductOrderBySellerAPI = async (req, res) => {
  const id = req.params.id;
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to filter product order by seller",
    });
  }

  const { role: isAuthRole } = authUser;
  if (isAuthRole !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to filter product order by seller",
    });
  }

  if (!id) {
    return res.status(400).json({
      message: "Id is required",
    });
  }

  try {
    const productOrderInstance = new ProductOrder(productOrderSchema, {});
    const productOrderOfSeller =  await productOrderInstance.getProductOrdersBySeller(id);

    return res.status(200).json({
      message: "Filter product order by seller successfully",
      sellerId: id,
      productOrderOfSeller,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

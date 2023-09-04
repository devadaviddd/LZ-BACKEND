import { PRODUCT_STATUS, ROLE } from "../../constants/index.js";
import { ProductOrder } from "../../models/ProductOrder.js";
import { productOrderSchema } from "../../repository/Schemas/productOrder.schema.js";

export const rejectProductAPI = async (req, res) => {
  const authUser = req.authUser;
  const id = req.params.id;

  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to reject product",
    });
  }

  if (!id) {
    return res.status(400).json({
      message: "Id is required",
    });
  }

  const { role } = authUser;
  if (role !== ROLE.CUSTOMER) {
    return res.status(403).json({
      message: "You don't have permission to reject product",
    });
  }

  try {
    const existedProductOrder = await ProductOrder.getProductOrder(id);
    if (!existedProductOrder) {
      return res.status(404).json({
        message: "Product order not found",
      });
    }

    const { status } = existedProductOrder;
    if (status !== PRODUCT_STATUS.SHIPPED) {
      return res.status(400).json({
        message: "Product order is not in shipped status",
      });
    }

    const productOrder = new ProductOrder(productOrderSchema, existedProductOrder);
    const updatedOrder = await productOrder.rejectProduct();

    return res.status(200).json({
      message: "Reject product successfully",
      updatedOrder,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

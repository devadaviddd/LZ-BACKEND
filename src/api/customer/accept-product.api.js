import { PRODUCT_STATUS, ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { ProductOrder } from "../../models/productOrder.js";
import { productOrderSchema } from "../../repository/Schemas/productOrder.schema.js";

export const acceptProductAPI = async (req, res) => {
  const authUser = req.authUser;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      message: "Product id is required",
    });
  }

  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to set product order status",
    });
  }

  const { _id: customerId, role } = authUser;
  if (role !== ROLE.CUSTOMER) {
    return res.status(403).json({
      message: "You don't have permission to set product order status",
    });
  }

  try {
    const existedProductOrder = await ProductOrder.getProductOrder(
      id,
      database
    );
    if (!existedProductOrder) {
      return res.status(404).json({
        message: "Product order not found to set status",
      });
    }

    const { status } = existedProductOrder;
    if (status !== PRODUCT_STATUS.SHIPPED) {
      return res.status(400).json({
        message: "Product order is not in shipped status",
      });
    }

    const productOrder = new ProductOrder(
      productOrderSchema,
      existedProductOrder
    );
    const updatedOrder = await productOrder.acceptProduct(database);

    return res.status(200).json({
      message: "Accept product successfully",
      updatedOrder,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

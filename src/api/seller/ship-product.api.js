import { PRODUCT_STATUS, ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { ProductOrder } from "../../models/productOrder.js";
import { productOrderSchema } from "../../repository/Schemas/productOrder.schema.js";

export const shipProductAPI = async (req, res) => {
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

  const { role } = authUser;
  if (role !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to set product order status",
    });
  }

  try {
    const existedProductOrderRecord = await ProductOrder.getProductOrder(
      id,
      database
    );
    if (!existedProductOrderRecord) {
      return res.status(404).json({
        message: "Product order not found to set status",
      });
    }
    const { status } = existedProductOrderRecord;

    if (status === PRODUCT_STATUS.NEW) {
      const productOrder = new ProductOrder(
        productOrderSchema,
        existedProductOrderRecord
      );

      const updateProductOrder = await productOrder.shipProduct(database);

      return res.status(200).json({
        message: "Ship product successfully",
        updateProductOrder,
      });
    }
    return res.status(400).json({
      message: "Product order status can not be set",
    });
  } catch (err) {
    if (err.message === "Product out of stock") {
      return res.status(400).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

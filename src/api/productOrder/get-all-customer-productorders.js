import { ROLE } from "../../constants/index.js";
import { Order } from "../../models/Order.js";
import { orderSchema } from "../../repository/Schemas/order.schema.js";

export const getAllCustomerProductOrders = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get customer orders",
    });
  }

  const { role, _id: customerId } = authUser;
  if (role !== ROLE.CUSTOMER) {
    return res.status(403).json({
      message: "You don't have permission to get customer orders",
    });
  }

  if (!customerId) {
    return res.status(400).json({
      message: "CustomerId is required",
    });
  }

  try {
    const orderInstance = new Order(orderSchema, {});
    const productOrderOfCustomer =
      await orderInstance.getShippedProductOrders(customerId);

    return res.status(200).json({
      message: "Filter product order by customer successfully",
      customerId: customerId,
      productOrderOfCustomer,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Order } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { ProductOrder } from "../../models/ProductOrder.js";
import { orderSchema } from "../../repository/Schemas/order.schema.js";
import { productOrderSchema } from "../../repository/Schemas/productOrder.schema.js";
import { ObjectId } from "mongodb";

export const createOrderAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to create order",
    });
  }
  const { role, _id: customerId } = authUser;
  if (role !== ROLE.CUSTOMER) {
    return res.status(403).json({
      message: "You don't have permission to create order",
    });
  }

  const { productOrders } = req.body;
  console.log("productOrders", productOrders);

  if (!productOrders || productOrders.length === 0) {
    return res.status(400).json({
      message: "Product orders are required",
    });
  }

  try {
    const newOrder = new Order(orderSchema, {
      customer: customerId,
    });
    await newOrder.insertOrderToDatabase();
    const orderId = newOrder._id;


    for (const productOrder of productOrders) {
      console.log("productOrder", productOrder);

      const existedProduct = await Product.getProductById(
        productOrder.product,
        database
      );
      console.log("existedProduct", existedProduct);

      if (!existedProduct) {
        await Order.deleteOrderById(orderId, database);
        await ProductOrder.deleteProductOrdersByOrderId(orderId, database);
        return res.status(400).json({
          message: "Product not found",
        });
      }

      if (!productOrder.product) {
        await Order.deleteOrderById(orderId, database);
        await ProductOrder.deleteProductOrdersByOrderId(orderId, database);
        return res.status(400).json({
          message: "Product is required",
        });
      }

      if (!productOrder.quantity) {
        await Order.deleteOrderById(orderId, database);
        await ProductOrder.deleteProductOrdersByOrderId(orderId, database);
        return res.status(400).json({
          message: "Quantity is required",
        });
      }

      const newProductOrder = new ProductOrder(productOrderSchema, {
        ...productOrder,
        order: orderId,
      });
      await newProductOrder.insertProductOrderToDatabase();
    }

    const productOrderRecords = await ProductOrder.getProductOrdersByOrderId(
      orderId,
      database
    );
    console.log("productOrderRecords", productOrderRecords);
    const productOrderIds = productOrderRecords.map(
      (productOrderRecord) => productOrderRecord._id
    );
    console.log("productOrderIds", productOrderIds);
    
    await Order.updateOrderById(orderId, {
      productOrders: productOrderIds,
    }, database);

    const updatedOrder = await Order.getOrderById(orderId, database);

    return res.status(200).json({
      message: "Create order successfully",
      order: updatedOrder,
    });
  } catch (err) {
    if (err.errors) {
      const { customer, product, quantity, price, status, order } = err.errors;
      return res.status(400).json({
        message: "Order not created",
        customer: customer?.message,
        product: product?.message,
        quantity: quantity?.message,
        price: price?.message,
        status: status?.message,
        order: order?.message,
      });
    }

    return res.status(500).json({
      message: "Order not created",
      error: "Internal server error",
    });
  }
};

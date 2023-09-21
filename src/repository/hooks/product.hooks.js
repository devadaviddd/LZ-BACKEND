import { database } from "../../di/index.js";
import { ObjectId } from "mongodb";
import { Order } from "../../models/order.js";

export async function beforeDeleteToProducts(doc, next) {
  const { _id } = doc;
  try {
    const productOrderRecords = await database.getRecordsByQuery(
      {
        product: _id,
      },
      "productorders"
    );
    const productOrderIds = productOrderRecords.map((record) => record._id);

    await database.deleteRecordsByQuery({ product: _id }, "productorders");

    const updateOrders = await Order.removeDeletedProductFromOrder(
      productOrderIds,
      database
    );

    next();
  } catch (error) {
    next(error);
  }
}

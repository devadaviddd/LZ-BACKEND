import { database } from "../../di/index.js";
import { ObjectId } from "mongodb";
import { Order } from "../../models/Order.js";

export async function beforeDeleteToProducts(doc, next) {
  const { _id } = doc;
  console.log("before delete", doc);
  try {
    const productOrderRecords = await database.getRecordsByQuery(
      {
        product: _id,
      },
      "productorders"
    );
    const productOrderIds = productOrderRecords.map((record) => record._id);

    console.log("productOrderRecords", productOrderRecords);

    await database.deleteRecordsByQuery({ product: _id }, "productorders");

    const updateOrders = await Order.removeDeletedProductFromOrder(
      productOrderIds,
      database
    );

    console.log("updateOrders", updateOrders);

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

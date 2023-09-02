import { database } from "../../di/index.js";

export async function afterDeleteToProducts(doc, next) {
  const { _id } = doc;
  try {
    await database.deleteRecordsByQuery({ productId: _id }, "productorders");
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

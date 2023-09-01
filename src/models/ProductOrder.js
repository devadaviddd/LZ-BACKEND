import { ProductOrderMapper } from "../repository/Mapper/mapper.js";
import { database } from "../di/index.js";
import mongoose from "mongoose";

export class ProductOrder {
  #productOrder;
  #productOrderModel;
  constructor(productOrderSchema, dto) {
    this.#productOrder = ProductOrderMapper.mapToSchema(
      productOrderSchema,
      dto
    );
    this.#productOrderModel = mongoose.model("ProductOrder");
  }

  async insertProductOrderToDatabase(productOrderId) {
    try {
      if (productOrderId) {
        this.#productOrder._id = new ObjectId(productOrderId);
      }
      await this.#productOrder.save();
      console.log("ProductOrder created");
      this._id = this.#productOrder._id;
      this.product = this.#productOrder.product;
      this.quantity = this.#productOrder.quantity;
      this.price = this.#productOrder.price;
      this.order = this.#productOrder.order;
    } catch (error) {
      throw error;
    }
  }

  static async getProductOrdersByOrderId(orderId) {
    const productOrderRecords = await database.getRecordsByQuery(
      { order: orderId },
      "productorders"
    );
    return productOrderRecords;
  }

  static async deleteProductOrdersByOrderId(orderId) {
    const productOrderRecords = await database.deleteRecordsByQuery(
      { order: orderId },
      "productorders"
    );
    return productOrderRecords;
  }

  async getProductOrdersBySeller(sellerId) {
    console.log("sellerId", sellerId);
    const productsJoined = await this.#productOrderModel.aggregate([
      {
        $lookup: {
          from: "products", // The name of the Product collection
          localField: "product", // The field in ProductOrder that connects to Product
          foreignField: "_id", // The field in Product that connects to ProductOrder
          as: "productData", // An alias for the joined Product documents
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $addFields: {
          productName: "$productData.title",
          image: "$productData.image",
          seller: "$productData.seller",
          stock: "$productData.stock",
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          image: 1,
          seller: 1,
          stock: 1,
          quantity: 1,
          price: 1,
        },
      },
    ]);
    console.log("productsJoined", productsJoined);

    const productOrderOfSeller = productsJoined.filter(
      (productOrder) => productOrder.seller == sellerId
    );
    console.log("productOrderOfSeller", productOrderOfSeller);

    return productOrderOfSeller;
  }
}

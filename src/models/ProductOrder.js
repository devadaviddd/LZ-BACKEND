import { ProductOrderMapper } from "../repository/Mapper/mapper.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { PRODUCT_STATUS } from "../constants/index.js";

export class ProductOrder {
  #productOrder;
  #productOrderCollection;
  constructor(productOrderSchema, dto) {
    this.#productOrder = ProductOrderMapper.mapToSchema(
      productOrderSchema,
      dto
    );
    this.#productOrderCollection = mongoose.model("ProductOrder");
    this._id = this.#productOrder._id;
    this.product = this.#productOrder.product;
    this.quantity = this.#productOrder.quantity;
    this.price = this.#productOrder.price;
    this.order = this.#productOrder.order;
  }

  static async getProductOrdersByOrderId(orderId, database) {
    const productOrderRecords = await database.getRecordsByQuery(
      { order: orderId },
      "productorders"
    );
    return productOrderRecords;
  }

  static async deleteProductOrdersByOrderId(orderId, database) {
    const productOrderRecords = await database.deleteRecordsByQuery(
      { order: new ObjectId(orderId) },
      "productorders"
    );
    return productOrderRecords;
  }

  static async getProductOrder(productId, database) {
    const productOrderRecord = await database.getRecordById(
      productId,
      "productorders"
    );
    return productOrderRecord;
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

  async acceptProduct(database) {
    await this.#productOrderCollection.updateOne(
      { _id: this._id },
      { $set: { status: PRODUCT_STATUS.ACCEPTED } }
    );

    const updatedProductOrder = await database.getRecordById(
      this._id.toString(),
      "productorders"
    );
    return updatedProductOrder;
  }

  async rejectProduct(database) {
    const productRecord = await database.getRecordById(
      this.#productOrder.product,
      "products"
    );
    console.log("productRecord", productRecord);

    const { stock, _id } = productRecord;
    const updatedStock = stock + this.#productOrder.quantity;

    await database.updateRecordById(
      _id.toString(),
      { stock: updatedStock },
      "products"
    );

    await this.#productOrderCollection.updateOne(
      { _id: this._id },
      { $set: { status: PRODUCT_STATUS.REJECTED } }
    );

    const updatedProductOrder = await database.getRecordById(
      this._id.toString(),
      "productorders"
    );
    return updatedProductOrder;
  }

  async cancelProduct(database) {
    await this.#productOrderCollection.updateOne(
      { _id: this._id },
      { $set: { status: PRODUCT_STATUS.CANCELED } }
    );
    const updatedProductOrder = await database.getRecordById(
      this._id.toString(),
      "productorders"
    );
    return updatedProductOrder;
  }

  async shipProduct(database) {
    const quantity = this.#productOrder.quantity;
    const productRecord = await database.getRecordById(
      this.#productOrder.product,
      "products"
    );
    console.log("productRecord", productRecord);

    const { stock, _id } = productRecord;

    if (quantity <= stock) {
      await this.#productOrderCollection.updateOne(
        { _id: this._id },
        { $set: { status: PRODUCT_STATUS.SHIPPED } }
      );

      const updatedStock = stock - quantity;
      await database.updateRecordById(
        _id.toString(),
        { stock: updatedStock },
        "products"
      );
      const updatedProductOrder = await database.getRecordById(
        this._id.toString(),
        "productorders"
      );
      return updatedProductOrder;
    } else {
      throw new Error("Product out of stock");
    }
  }

  async getProductOrdersBySeller(sellerId) {
    console.log("sellerId", sellerId);
    const productOrderOfSeller = await this.#productOrderCollection.aggregate([
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
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$$ROOT",
              {
                title: "$productData.title",
                price: "$productData.price",
                description: "$productData.description",
                image: "$productData.image",
                category: "$productData.categories",
                seller: "$productData.seller",
                date: "$productData.date",
                stock: "$productData.stock",
              },
            ],
          },
        },
      },
      {
        $match: {
          seller: new ObjectId(sellerId),
        },
      },
      {
        $project: {
          productData: 0,
          product: 0,
        },
      },
    ]);
    console.log("productOrderOfSeller", productOrderOfSeller);
    return productOrderOfSeller;
  }
}

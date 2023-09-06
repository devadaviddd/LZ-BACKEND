import { OrderMapper } from "../repository/Mapper/mapper.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export class Order {
  #order;
  #orderModel;
  constructor(orderSchema, dto) {
    this.#order = OrderMapper.mapToSchema(orderSchema, dto);
    this.#orderModel = mongoose.model("Order");
    this._id = this.#order._id;
    this.customer = this.#order.customer;
    this.productOrders = this.#order.productOrders;
  }

  static async getOrderById(orderId, database) {
    const orderRecord = await database.getRecordById(orderId, "orders");
    return orderRecord;
  }

  static async updateOrderById(orderId, updateFields, database) {
    const result = await database.updateRecordById(
      orderId,
      updateFields,
      "orders"
    );
    return result;
  }

  static async deleteOrderById(orderId, database) {
    const result = await database.deleteRecordById(orderId, "orders");
    return result;
  }

  async insertOrderToDatabase(orderId) {
    try {
      if (orderId) {
        this.#order._id = new ObjectId(orderId);
      }
      await this.#order.save();
      console.log("Order created");
      this._id = this.#order._id;
      this.customer = this.#order.customer;
      this.productOrders = this.#order.productOrders;
    } catch (error) {
      throw error;
    }
  }

  async getShippedProductOrders(customerId) {
    console.log("customerId", customerId);
    const productOrderOfCustomer = await this.#orderModel.aggregate([
      {
        $lookup: {
          from: "productorders",
          localField: "productOrders",
          foreignField: "_id",
          as: "productOrders",
        },
      },
      {
        $unwind: "$productOrders",
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$$ROOT", "$productOrders"],
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productOrders.product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $match: {
          customer: new ObjectId(customerId),
        },
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
        $project: {
          productOrders: 0,
          productData: 0,
          product: 0,
          customer: 0,
          __v: 0,
        },
      },
    ]);
    console.log("productOrderOfCustomer", productOrderOfCustomer);
    return productOrderOfCustomer;
  }
}

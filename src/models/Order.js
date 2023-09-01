import { OrderMapper } from "../repository/Mapper/mapper.js";
import { database } from "../di/index.js";

export class Order {
  #order;
  constructor(orderSchema, dto) {
    this.#order = OrderMapper.mapToSchema(orderSchema, dto);
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

  static async getOrderById (orderId) {
    const orderRecord = await database.getRecordById(orderId, "orders");
    return orderRecord;
  }
}
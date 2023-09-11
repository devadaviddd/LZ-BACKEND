import { CartMapper } from "../repository/Mapper/mapper.js";

export class Cart {
  #cart;
  constructor(cartSchema, dto) {
    this.#cart = CartMapper.mapToSchema(cartSchema, dto);
    this.cart = this.#cart.cart;
  }

  static async getCartByCustomerId(customerId, database) {
    const cartRecord = await database.getRecordById(customerId, "carts");
    return cartRecord;
  }

  static async updateCart(customerId, newCart, database) {
    const pipeline = {
      cart: newCart,
    };

    await database.updateRecordById(customerId, pipeline, "carts");
    const updatedCart = await database.getRecordById(customerId, "carts");
    return updatedCart;
  }

  static async deleteCartAPI(customerId, database) {
    await database.deleteRecordById(customerId, "carts");
    return true;
  }

  async insertCartToDatabase(customerId) {
    if (!customerId) {
      throw new Error("customerId is required");
    }
    this.#cart._id = customerId;
    await this.#cart.save();
    try {
    } catch (error) {
      throw error;
    }
  }
}

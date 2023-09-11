import { CartMapper } from "../repository/Mapper/mapper.js";

export class Cart {
  #cart;
  constructor(cartSchema, dto) {
    console.log("dto", dto);
    this.#cart = CartMapper.mapToSchema(cartSchema, dto);
    console.log("this.#cart", this.#cart);
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

    console.log("newCart", newCart);
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
    console.log("Cart created");
    try {
    } catch (error) {
      throw error;
    }
  }
}

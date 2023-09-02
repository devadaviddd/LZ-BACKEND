import { database } from "../di/index.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ProductMapper } from "../repository/Mapper/mapper.js";
export class Product {
  #product;
  constructor(productSchema, dto) {
    this.#product = ProductMapper.mapToSchema(productSchema, dto);
  }
  async insertProductToDatabase(productId) {
    try {
      if (productId) {
        this.#product._id = new ObjectId(productId);
      }
      await this.#product.save();
      console.log("Product created");
      this._id = this.#product._id;
      this.title = this.#product.title;
      this.price = this.#product.price;
      this.description = this.#product.description;
      this.categories = this.#product.categories;
      this.image = this.#product.image;
      this.createdBy = this.#product.createdBy;
      this.date = this.#product.date;
      this.stock = this.#product.stock;
      this.image = this.#product.image;
      this.seller = this.#product.seller;
    } catch (error) {
      throw error;
    }
  }

  static async getAllProducts() {
    const productRecords = await database.getRecordsByQuery({}, "products");
    return productRecords;
  }

  static async getProductById(productId) {
    const productRecord = await database.getRecordById(productId, "products");
    return productRecord;
  }

  static async getProductByCategoryId(categoryId) {
    const productRecords = await database.getRecordsByQuery(
      { categories: new ObjectId(categoryId) },
      "products"
    );
    console.log("productRecords", productRecords);
    return productRecords;
  }

  static async getImagePath(productId) {
    const productRecord = await database.getRecordById(productId, "products");
    return productRecord.image;
  }

  static async getAllAvailableProducts() {
    const productRecords = await database.getRecordsByQuery(
      { stock: { $gt: 0 } },
      "products"
    );
    return productRecords;
  }
}

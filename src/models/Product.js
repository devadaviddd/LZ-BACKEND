import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ProductMapper } from "../repository/Mapper/mapper.js";
import { getCategories } from "../api/product/create-product.api.js";
export class Product {
  #product;
  #productModel;
  constructor(productSchema, dto) {
    console.log("dto", dto);
    this.#product = ProductMapper.mapToSchema(productSchema, dto);
    this.#productModel = mongoose.model("Product");
    this._id = this.#product._id;
    this.title = this.#product.title;
    this.price = this.#product.price;
    this.description = this.#product.description;
    this.categories = this.#product.categories;
    this.image = this.#product.image;
    this.createdBy = this.#product.createdBy;
    this.date = this.#product.date;
    this.stock = this.#product.stock;
    this.seller = this.#product.seller;
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

  async updateProduct(productId, dto, database) {
    const updateFields = {};

    const { title, price, description, categoryId, stock } = dto;

    if (title && title !== this.title) {
      updateFields.title = title;
    }

    if (price && price !== this.price) {
      updateFields.price = price;
    }

    if (description && description !== this.description) {
      updateFields.description = description;
    }

    if (categoryId) {
      const categories = await getCategories(categoryId);
      console.log("categories", categories);
      updateFields.categories = categories;
    }

    if (stock && stock !== this.stock) {
      updateFields.stock = stock;
    }

    if (Object.keys(updateFields).length > 0) {
      console.log("updateFields", updateFields);
      await database.updateRecordById(
        productId,
        {
          ...updateFields,
        },
        "products"
      );
      const updateProduct = await database.getRecordById(productId, "products");
      return updateProduct;
    }
    return null;
  }

  static async getProductById(productId, database) {
    const productRecord = await database.getRecordById(productId, "products");
    return productRecord;
  }

  static async getProductByCategoryId(categoryId, database) {
    const productRecords = await database.getRecordsByQuery(
      { categories: new ObjectId(categoryId) },
      "products"
    );
    console.log("productRecords", productRecords);
    return productRecords;
  }

  static async getImagePath(productId, database) {
    const productRecord = await database.getRecordById(productId, "products");
    return productRecord.image;
  }

  static async getAllAvailableProducts(database) {
    const productRecords = await database.getRecordsByQuery(
      { stock: { $gt: 0 } },
      "products"
    );
    return productRecords;
  }

  static async getProductBySellerId(sellerId, database) {
    const productRecords = await database.getRecordsByQuery(
      { seller: new ObjectId(sellerId) },
      "products"
    );
    return productRecords;
  }

  async deleteProduct(productId, database) {
    const productOrderRecords = await database.getRecordsByQuery(
      {
        product: new ObjectId(productId),
      },
      "productorders"
    );

    const productOrderIds = productOrderRecords.map((record) => record._id);

    console.log("productOrderRecords", productOrderRecords);

    await database.deleteRecordsByQuery(
      { product: new ObjectId(productId) },
      "productorders"
    );

    const updateOrders = await database.removeDeletedProductFromOrder(
      productOrderIds,
      "orders"
    );
    console.log("updateOrders", updateOrders);

    const isDeleteSuccess = await this.#productModel.deleteOne({
      _id: new ObjectId(productId),
    });
    return isDeleteSuccess;
  }
}

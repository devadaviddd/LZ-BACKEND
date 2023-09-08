import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ProductMapper } from "../repository/Mapper/mapper.js";
import { getCategories } from "../api/product/create-product.api.js";
import { Order } from "./Order.js";
export class Product {
  #product;
  #productCollection;
  constructor(productSchema, dto) {
    console.log("dto", dto);
    this.#product = ProductMapper.mapToSchema(productSchema, dto);
    this.#productCollection = mongoose.model("Product");
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

  static async updateProductImage(id, imagePath, database) {
    const updateFields = {
      imagePath,
    };
    await database.updateRecordById(id, imagePath, "products");
    const updateProduct = await database.getRecordById(id, "products");
    return updateProduct;
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

  async updateExtraAttributes(productId, extraAttributes, database) {
    const result = await database.updateRecordById(
      productId,
      extraAttributes,
      "products"
    )
    return result;
  }

  async updateProduct(productId, dto, database) {
    let updateFields = {};

    const { title, price, description, categoryId, stock } = dto;

    if (title && title !== this.title) {
      console.log("title", title);
      updateFields.title = title;
    } else {
      updateFields.title = this.title;
    }

    if (price && price !== this.price) {
      updateFields.price = price;
    } else {
      updateFields.price = this.price;
    }

    if (description && description !== this.description) {
      updateFields.description = description;
    } else {
      updateFields.description = this.description;
    }

    if (categoryId) {
      const categories = await getCategories(categoryId);
      console.log("categories", categories);
      updateFields.categories = categories;
    } else {
      updateFields.categories = this.categories;
    }

    if (stock && stock !== this.stock) {
      updateFields.stock = stock;
    } else {
      updateFields.stock = this.stock;
    }

    console.log("updateFields", updateFields);
    console.log("dto", dto);

    for (const key in dto) {
      if (
        dto.hasOwnProperty(key) &&
        key !== "title" &&
        key !== "price" &&
        key !== "description" &&
        key !== "categoryId" &&
        key !== "stock"
      ) {
        updateFields[key] = dto[key];
      }
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

    const updateOrders = await Order.removeDeletedProductFromOrder(
      productOrderIds,
      database
    );
    console.log("updateOrders", updateOrders);

    const isDeleteSuccess = await this.#productCollection.deleteOne({
      _id: new ObjectId(productId),
    });
    return isDeleteSuccess;
  }
}

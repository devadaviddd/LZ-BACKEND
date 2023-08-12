import { database } from "../di/index.js";
import { CategoryMapper } from "../repository/Mapper/mapper.js";
import { categorySchema } from "../repository/Schemas/category.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export class Category {
  #category;
  #categoryModel;
  constructor(categorySchema, dto) {
    this.#category = CategoryMapper.mapToSchema(categorySchema, dto);
    this.#categoryModel = mongoose.model("Category");
  }

  async insertCategory(categoryId) {
    try {
      if (categoryId) {
        this.#category._id = new ObjectId(categoryId);
      }
      await this.#category.save();
      console.log("Category created");
      this._id = this.#category._id;
      this.name = this.#category.name;
      this.parentId = this.#category.parentId;
      this.admins = this.#category.admins;
      this.subCategories = this.#category.subCategories;
    } catch (error) {
      throw error;
    }
  }

  async updateSubCategory({ parentId, subCategoryId }) {
    try {
      const newCategory = await this.#categoryModel.findOneAndUpdate(
        {
          _id: parentId,
        },
        {
          $push: {
            subCategories: new ObjectId(subCategoryId),
          },
        },
        {
          new: true,
        }
      );
      console.log("Category updated");
      this.#category = newCategory;
      this._id = this.#category._id;
      this.name = this.#category.name;
      this.parentId = this.#category.parentId;
      this.admins = this.#category.admins;
      this.subCategories = this.#category.subCategories;
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryById(categoryId) {
    const categoryRecord = await database.getRecordById(
      categoryId,
      "categories"
    );
    return categoryRecord;
  }

  static async getCategories() {
    const categories = await database.getRecordsByQuery({}, "categories");
    return categories;
  }

  static async getCategoriesById(categoryId) {
    const query = {
      _id: new ObjectId(categoryId),
    };
    const categoryRecords = await database.getRecordsByQuery(
      query,
      "categories"
    );
    return categoryRecords;
  }
}

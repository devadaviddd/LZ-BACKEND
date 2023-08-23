import { database } from "../di/index.js";
import { CategoryMapper } from "../repository/Mapper/mapper.js";
import { categorySchema } from "../repository/Schemas/category.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

function handleCategoryModified(newAdmin, admins) {
  if (admins.includes(newAdmin)) {
    return null;
  } else {
    return {
      $push: {
        admins: new ObjectId(newAdmin),
      },
    };
  }
}

export class Category {
  #category;
  #categoryModel;
  constructor(categorySchema, dto) {
    this.#category = CategoryMapper.mapToSchema(categorySchema, dto);
    this.#categoryModel = mongoose.model("Category");
    this._id = this.#category._id;
    this.name = this.#category.name;
    this.parentId = this.#category.parentId;
    this.admins = this.#category.admins;
    this.subCategories = this.#category.subCategories;
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

  async updateCategory(categoryId, adminId, dto) {
    const updateFields = {};
    console.log("dto", dto);
    const dtoProperties = Object.keys(dto);
    dtoProperties.forEach((property) => {
      if (
        dto.hasOwnProperty(property) &&
        property !== "name" &&
        property !== "parentId" &&
        property !== "admins" &&
        property !== "subCategories"
      ) {
        updateFields[property] = dto[property];
      }
    });
    try {
      console.log("updateFields", updateFields);
      if (this.subCategories.length > 0) {
        const ancestorCategoryRecords = await database.getRecordsByQuery(
          {
            parentId: new ObjectId(categoryId),
          },
          "categories"
        );
        console.log("categoryId", categoryId);
        console.log("ancestorCategoryRecords", ancestorCategoryRecords);
        const updateAncestorCategories = ancestorCategoryRecords.map(
          async (record) => {
            await database.updateRecordById(
              record._id,
              updateFields,
              "categories"
            );
          }
        );
        await Promise.all(updateAncestorCategories);
      }

      await database.updateRecordById(categoryId, updateFields, "categories");

      const newCategory = await this.#categoryModel.findOneAndUpdate(
        {
          _id: categoryId,
        },
        {
          $set: {
            name: dto.name,
            parentId: dto.parentId,
          },
          ...handleCategoryModified(adminId, this.admins),
        },
        {
          new: true,
        }
      );
      console.log("newCategory", newCategory);
      console.log("Category updated");
      this.#category = newCategory;
      this._id = this.#category._id;
      this.name = this.#category.name;
      this.parentId = this.#category.parentId;
      this.admins = this.#category.admins;
      this.subCategories = this.#category.subCategories;
      Object.assign(this, updateFields);
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

  static async getAllCategories() {
    const categories = await database.getRecordsByQuery({}, "categories");
    return categories;
  }
}

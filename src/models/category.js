import { CategoryMapper } from "../repository/Mapper/mapper.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export class Category {
  #category;
  #categoryCollection;
  constructor(categorySchema, dto) {
    this.#category = CategoryMapper.mapToSchema(categorySchema, dto);
    this.#categoryCollection = mongoose.model("Category");
    this._id = this.#category._id;
    this.name = this.#category.name;
    this.parentId = this.#category.parentId;
    this.admins = this.#category.admins;
    this.subCategories = this.#category.subCategories;
  }

  static async getCategoryById(categoryId, database) {
    const categoryRecord = await database.getRecordById(
      categoryId,
      "categories"
    );
    return categoryRecord;
  }

  static async getAllCategories(database) {
    const categoryRecords = await database.getRecordsByQuery({}, "categories");
    return categoryRecords;
  }

  static async deleteCategory(categoryId, database) {
    const isDeleteSuccess = await database.deleteRecordById(
      categoryId,
      "categories"
    );
    return isDeleteSuccess;
  }

  static async removeSubCategory(parentId, subCategoryId, database) {
    const updatePipeLine = {
      $pull: {
        subCategories: {
          $in: [new ObjectId(subCategoryId)],
        },
      },
    };
    const query = {
      _id: new ObjectId(parentId),
    };

    const result = await database.updateOneRecordByQuery(
      query,
      updatePipeLine,
      "categories"
    );
    return result;
  }

  static async getSubCategoryByName(name, database) {
    const subCategoryRecord = await database.getRecordsByQuery(
      {
        name: name,
      },
      "categories"
    );
    return subCategoryRecord[0];
  }

  static async getRecordsByQuery(query, database) {
    const records = await database.getRecordsByQuery(query, "categories");
    return records;
  }

  #isArraysEqual(array1, array2) {
    if (array1.length !== array2.length) {
      return false; // Arrays are of different lengths, so not equal
    }

    for (let i = 0; i < array1.length; i++) {
      if (!array1[i].equals(array2[i])) {
        return false; // Elements at position i are not equal
      }
    }

    return true; // All elements are equal
  }

  #elementDiff(array1, array2) {
    const filteredArray1 = array1.filter(
      (id) => !array2.some((compareId) => compareId.equals(id))
    );
    return filteredArray1;
  }

  #handleCategoryModified(newAdmin, admins) {
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

  async insertCategory(categoryId) {
    try {
      if (categoryId) {
        this.#category._id = new ObjectId(categoryId);
      }
      await this.#category.save();
      this._id = this.#category._id;
      this.name = this.#category.name;
      this.parentId = this.#category.parentId;
      this.admins = this.#category.admins;
      this.subCategories = this.#category.subCategories;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(categoryId, adminId, dto, database) {
    const updateFields = {};
    let isCreateNewSubCategory = false;
    const subCategoriesName = [];
    if (this.#category.subCategories.length > 0) {
      const subCategoriesId = this.#category.subCategories;

      for (const subCategoryId of subCategoriesId) {
        const subCategoryRecord = await database.getRecordById(
          subCategoryId.toString(),
          "categories"
        );
        subCategoriesName.push(subCategoryRecord.name);
      }
    }

    const { subCategories } = dto;
    const subCategoriesId = [];
    if (subCategories) {
      for (const subCategory of subCategories) {
        const subCategoryRecord = await database.getRecordsByQuery(
          {
            name: subCategory,
          },
          "categories"
        );
        if (subCategoryRecord.length > 0) {
          subCategoriesId.push(subCategoryRecord[0]._id);
        }
      }
    }
    if (subCategories && subCategoriesId.length !== subCategories.length) {
      isCreateNewSubCategory = true;
    }

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

    let subCategoryDiff;
    if (
      !this.#isArraysEqual(this.#category.subCategories, subCategoriesId) &&
      !isCreateNewSubCategory
    ) {
      subCategoryDiff = this.#elementDiff(
        this.#category.subCategories,
        subCategoriesId
      );
      if (subCategoryDiff.length > 0) {
        subCategoryDiff.map(async (id) => {
          await database.removeIdFromListById(
            categoryId,
            id.toString(),
            "categories"
          );
        });
      }
    }

    try {
      const ancestorCategoryRecords = await database.getRecordsByQuery(
        {
          parentId: new ObjectId(categoryId),
        },
        "categories"
      );
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

      await database.updateRecordById(categoryId, updateFields, "categories");

      const newCategory = await this.#categoryCollection.findOneAndUpdate(
        {
          _id: categoryId,
        },
        {
          $set: {
            name: dto.name,
            parentId: dto.parentId,
          },
          ...this.#handleCategoryModified(adminId, this.admins),
        },
        {
          new: true,
        }
      );
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
      const newCategory = await this.#categoryCollection.findOneAndUpdate(
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
}

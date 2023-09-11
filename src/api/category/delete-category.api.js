import mongoose from "mongoose";
import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Category } from "../../models/Category.js";
import { categorySchema } from "../../repository/Schemas/category.schema.js";
const ObjectId = mongoose.Types.ObjectId;

export const deleteCategoryAPI = async (req, res) => {
  const categoryId = req.params.id;
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to create category",
    });
  }
  const { _id: adminId, role } = authUser;
  if (role !== ROLE.ADMIN) {
    return res.status(403).json({
      message: "You don't have permission to create category",
    });
  }

  try {
    const existedCategoryRecord = await Category.getCategoryById(
      categoryId,
      database
    );

    if (existedCategoryRecord) {
      const productsHasThisCategory = await Category.getRecordsByQuery(
        {
          categories: {
            $elemMatch: {
              $eq: new ObjectId(categoryId),
            },
          },
        },
        database
      );

      if (productsHasThisCategory.length > 0) {
        return res.status(400).json({
          message: "Cannot delete category because it has products",
        });
      }

      const categoriesHasThisCategory = await Category.getRecordsByQuery(
        {
          subCategories: {
            $elemMatch: {
              $eq: new ObjectId(categoryId),
            },
          },
        },
        database
      );

      const category = new Category(categorySchema, existedCategoryRecord);

      if (category.subCategories.length > 0) {
        return res.status(400).json({
          message: "Cannot delete category because it has sub categories",
        });
      }

      if (categoriesHasThisCategory.length > 0) {
        const deleteThisSubCategories = categoriesHasThisCategory.map(
          async (record) => {
            await Category.removeSubCategory(record._id, categoryId, database);
          }
        );
        await Promise.all(deleteThisSubCategories);
      }

      await Category.deleteCategory(categoryId, database);
      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Category not found to delete",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

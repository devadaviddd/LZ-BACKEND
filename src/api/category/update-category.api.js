import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Category } from "../../models/Category.js";
import { categorySchema } from "../../repository/Schemas/category.schema.js";
import { isCategoryNameExist } from "../../utils/errors/duplicateCategoryName.js";

export const updateCategoryAPI = async (req, res) => {
  const authUser = req.authUser;
  const { updateFields, parentId } = req.body;
  const categoryId = req.params.id;
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

    if (parentId) {
      const existedCategoryParentRecord = await Category.getCategoryById(
        parentId,
        database
      );
      if (!existedCategoryParentRecord) {
        return res.status(400).json({
          message: "Parent category not found",
        });
      }
    }
    if (existedCategoryRecord) {
      const category = new Category(categorySchema, existedCategoryRecord);
      await category.updateCategory(
        categoryId,
        adminId,
        updateFields,
        database
      );
      return res.status(200).json({
        message: "Category updated successfully",
        category,
      });
    } else {
      return res.status(404).json({
        message: "Category not found to update",
      });
    }
  } catch (err) {
    if (err.errors) {
      const { name } = err.errors;
      return res.status(400).json({
        message: "Category not created",
        name: name?.message,
      });
    }
    if (err) {
      return res.status(400).json({
        message: "Category not created",
        error: isCategoryNameExist(err.message)
          ? "Category name already exist"
          : err.message,
      });
    }
  }
  res.status(500).json({
    message: "Category not created",
    error: "Internal server error",
  });
};

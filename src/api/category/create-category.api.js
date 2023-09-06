import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Category } from "../../models/Category.js";
import { categorySchema } from "../../repository/Schemas/category.schema.js";
import { isCategoryNameExist } from "../../utils/errors/duplicateCategoryName.js";

export const createCategoryAPI = async (req, res) => {
  const authUser = req.authUser;
  const { name, updateFields } = req.body;
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
    const category = new Category(categorySchema, {
      name,
      admins: [adminId],
    });
    await category.insertCategory();

    await category.updateCategory(
      category._id,
      adminId,
      updateFields,
      database
    );

    return res.status(200).json({
      message: "Main Category created successfully",
      category,
      createdBy: `${authUser.name} - ${authUser.email}`,
    });
  } catch (err) {
    console.log(err);
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

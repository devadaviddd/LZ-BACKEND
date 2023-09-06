import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Category } from "../../models/Category.js";
import { categorySchema } from "../../repository/Schemas/category.schema.js";
import { isCategoryNameExist } from "../../utils/errors/duplicateCategoryName.js";
import { ObjectId } from "mongodb";

export const createSubCategoryAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to create subcategory",
    });
  }
  const { _id: adminId, role } = authUser;
  const { name, updateFields } = req.body;
  console.log("updateFields", updateFields);
  const parentId = req.params.id;

  const existedSubCategoryRecord = await database.getRecordsByQuery(
    {
      name: name,
    },
    "categories"
  );
  console.log("existedSubCategoryRecord", existedSubCategoryRecord);

  if (role !== ROLE.ADMIN) {
    return res.status(403).json({
      message: "You don't have permission to create subcategory",
    });
  }
  try {
    const parentCategoryRecord = await Category.getCategoryById(parentId, database);

    if (!parentCategoryRecord) {
      return res.status(400).json({
        message: "Parent category not found to create sub category",
      });
    }

    let category;
    if (existedSubCategoryRecord.length === 0) {
      category = new Category(categorySchema, {
        name,
        parentId,
        updateFields,
        admins: [adminId],
      });
      parentCategoryRecord.subCategories.push(category._id);
    } else {
      parentCategoryRecord.subCategories.push(existedSubCategoryRecord[0]._id);
      await database.updateRecordById(
        existedSubCategoryRecord[0]._id,
        {
          parentId,
        },
        "categories"
      );
    }

    const parentCategory = new Category(categorySchema, parentCategoryRecord);
    await parentCategory.updateSubCategory({
      parentId: parentCategoryRecord._id,
      subCategoryId: category ? category._id : existedSubCategoryRecord[0]._id,
    });
    if (existedSubCategoryRecord.length === 0) {
      await category.insertCategory(category._id);
      await database.updateRecordById(
        category._id,
        {
          ...updateFields,
        },
        "categories"  
      );
    }
    return res.status(200).json({
      message: "Sub Category created successfully",
      parentCategory: parentCategory,
      category: category,
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

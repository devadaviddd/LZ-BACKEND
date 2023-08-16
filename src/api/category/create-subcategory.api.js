import { ROLE } from "../../constants/role.js";
import { Category } from "../../models/Category.js";
import { categorySchema } from "../../repository/Schemas/category.schema.js";
import { isCategoryNameExist } from "../../utils/errors/duplicateCategoryName.js";


export const  createSubCategoryAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to create subcategory",
    });
  }
  const { _id: adminId, role } = authUser;
  const { name } = req.body;
  const parentId = req.params.id;
  
  if (role !== ROLE.ADMIN) {  
    return res.status(403).json({
      message: "You don't have permission to create subcategory",
    });
  }
  try {
    const parentCategoryRecord = await Category.getCategoryById(parentId);

    if (!parentCategoryRecord) {
      return res.status(400).json({
        message: "Parent category not found to create sub category",
      });
    }
    const category = new Category(categorySchema, {
      name,
      parentId,
      admins: [adminId],
    });

    parentCategoryRecord.subCategories.push(category._id);
    
    const parentCategory = new Category(categorySchema, parentCategoryRecord);

    await parentCategory.updateSubCategory({
      parentId,
      subCategoryId: category._id,
    });
    
    await category.insertCategory(category._id);
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
}
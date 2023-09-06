import { database } from "../../di/index.js";
import { Category } from "../../models/Category.js";


function generateSubCategories(category, allCategories) {
  const subCategoryMap = {};

  if (category.subCategories && category.subCategories.length > 0) {
    category.subCategories.forEach((subCategoryId) => {
      const subCategory = allCategories.find(
        (c) => c._id.toString() === subCategoryId.toString()
      );
      if (subCategory) {
        subCategoryMap[subCategory.name] = {
          _id: subCategory._id,
          subCategories: generateSubCategories(subCategory, allCategories),
        };
      }
    });
  }
  return subCategoryMap;
}

function generateCategoryTree(rootCategories, allCategories) {
  const categoryTree = {};
  rootCategories.forEach((category) => {
    categoryTree[category.name] = {
      _id: category._id,
      subCategories: generateSubCategories(category, allCategories),
    };
  });

  return categoryTree;
}

export const getAllCategoryTreeAPI = async (req, res) => {
  try {
    const categories = await Category.getAllCategories(database);
    const mainCategory = categories.filter((category) => {
      return !category.parentId;
    });
    const hierarchicalCategoryTree = generateCategoryTree(
      mainCategory,
      categories
    );
    return res.status(200).json({
      message: "Get category tree successfully",
      hierarchicalCategoryTree,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

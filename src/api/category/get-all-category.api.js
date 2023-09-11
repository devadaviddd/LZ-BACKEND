import { ROLE } from "../../constants/index.js";
import { Category } from "../../models/Category.js";
import { Admin } from "../../models/Admin.js";
import { database } from "../../di/index.js";

async function getAdminEmailsByIds(adminIds) {
  const adminNames = [];
  for (const adminId of adminIds) {
    const admin = await Admin.getAdminEmailsByIds(adminId, database);
    adminNames.push(admin);
  }
  return adminNames;
}

async function getCategoryNamesByIds(categoryIds) {
  const categoryNames = [];
  for (const categoryId of categoryIds) {
    const category = await Category.getCategoryById(categoryId, database);
    categoryNames.push(category.name);
  }
  return categoryNames;
}

export const getAllCategoryAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get all category",
    });
  }

  try {
    const categories = await Category.getAllCategories(database);
    const count = categories.length;

    const categoriesWithAdminNames = await Promise.all(
      categories.map(async (category) => {
        const adminIds = category.admins;
        const adminNames = await getAdminEmailsByIds(adminIds);

        return {
          adminNames,
        };
      })
    );

    const categoriesWithSubCategoryNames = await Promise.all(
      categories.map(async (category) => {
        const subCategoryIds = category.subCategories;
        const subCategoryNames = await getCategoryNamesByIds(subCategoryIds);
        return {
          subCategoryNames,
        };
      })
    );

    const categoriesMerged = categories.map((category, index) => ({
      ...category,
      admins: categoriesWithAdminNames[index].adminNames,
      subCategoryNames: categoriesWithSubCategoryNames[index].subCategoryNames,
    }));

    return res.status(200).json({
      message: "Get all categories successfully",
      count,
      categories: categoriesMerged,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

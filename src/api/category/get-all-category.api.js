import { ROLE } from "../../constants/index.js";
import { Category } from "../../models/Category.js";
import { Admin } from "../../models/Admin.js";

async function getAdminEmailsByIds(adminIds) {
  const adminNames = [];
  for (const adminId of adminIds) {
    console.log("adminId", adminId);
    const admin = await Admin.getAdminEmailsByIds(adminId);
    console.log("adminNames", admin);
    adminNames.push(admin);
  }
  return adminNames;
}

export const getAllCategoryAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get all category",
    });
  }
  const { role } = authUser;
  if (role !== ROLE.ADMIN) {
    return res.status(403).json({
      message: "You don't have permission to get all category",
    });
  }
  try {
    const categories = await Category.getAllCategories();
    const count = categories.length;

    const categoriesWithAdminNames = await Promise.all(
      categories.map(async (category) => {
        const adminIds = category.admins;
        const adminNames = await getAdminEmailsByIds(adminIds);
        return {
          ...category,
          adminNames,
        };
      })
    );

    const categoriesMerged = categories.map((category, index) => ({
      ...category,
      admins: categoriesWithAdminNames[index].adminNames,
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

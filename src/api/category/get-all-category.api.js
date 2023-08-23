import { ROLE } from "../../constants/index.js";
import { Category } from "../../models/Category.js";

export const getAllCategory = async (req, res) => {
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
    return res.status(200).json({
      message: "Get all categories successfully",
      count,
      categories,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

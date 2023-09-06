import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Category } from "../../models/Category.js";

export const getCategoryByIdAPI = async (req, res) => {
  const categoryId = req.params.id;

  if (!categoryId) {
    return res.status(400).json({
      message: "Category id is required",
    });
  }

  try {
    const category = await Category.getCategoryById(categoryId, database);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    return res.status(200).json({
      message: "Get category by id successfully",
      category,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

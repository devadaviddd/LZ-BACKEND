import { Category } from "../../models/Category.js";

/**
 * @openapi
 * /admin/category:
 *   get:
 *     tags: [Admin]
 *     summary: Get the hierarchical category tree
 *     description: Use this route to retrieve the hierarchical category tree.
 *     responses:
 *       200:
 *         description: Category tree retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                hierarchicalCategoryTree:
 *                  type: object
 *  
 *                    
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
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
          sub: generateSubCategories(subCategory, allCategories),
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
      sub: generateSubCategories(category, allCategories),
    };
  });

  return categoryTree;
}

export const getAllCategoryTreeAPI = async (req, res) => {
  try {
    const categories = await Category.getCategories();
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

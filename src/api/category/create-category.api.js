import { ROLE } from "../../constants/index.js";
import { Category } from "../../models/Category.js";
import { categorySchema } from "../../repository/Schemas/category.schema.js";
import { isCategoryNameExist } from "../../utils/errors/duplicateCategoryName.js";

/**
 * @openapi
 * /admin/category:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new category
 *     description: Use this route to create a new category or sub-category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *             example:
 *               name: Electronics
 *               parentId: 64d78f463793095ca1ac5778
 *     responses:
 *       200:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *                 parentCategory:
 *                   type: object
 *                 createdBy:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
export const createCategoryAPI = async (req, res) => {
  const authUser = req.authUser;
  const { name, parentId } = req.body;
  console.log("in create category api");
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
    const isCreateMainCategory = !parentId;
    if (isCreateMainCategory) {
      const category = new Category(categorySchema, {
        name,
        admins: [adminId],
      });
      await category.insertCategory();
      return res.status(200).json({
        message: "Main Category created successfully",
        category,
        createdBy: `${authUser.name} - ${authUser.email}`,
      });
    } else {
      // only allow to create 1 sub level in one API
      const parentCategoryRecord = await Category.getCategoryById(parentId);

      if (!parentCategoryRecord) {
        return res.status(400).json({
          message: "Parent category not found",
        });
      }
      const category = new Category(categorySchema, {
        name,
        parentId,
        admins: [adminId],
      });

      parentCategoryRecord.subCategories.push(category._id);
      const parentCategory = new Category(categorySchema, parentCategoryRecord);
      console.log("parentCategory", parentCategory);

      await category.insertCategory();
      await parentCategory.updateSubCategory({
        parentId,
        subCategoryId: category._id,
      });

      return res.status(200).json({
        message: "Sub Category created successfully",
        parentCategory: parentCategory,
        category: category,
        createdBy: `${authUser.name} - ${authUser.email}`,
      });
    }
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

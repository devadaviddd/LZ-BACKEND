import { ROLE } from "../../constants/index.js";
import { productSchema } from "../../repository/Schemas/product.schema.js";
import { Seller } from "../../models/seller.js";
import { Product } from "../../models/product.js";
import { database } from "../../di/index.js";
import { Category } from "../../models/category.js";

export async function getCategories(categoryId) {
  if (!categoryId) {
    return [];
  }
  const existedCategory = await Category.getCategoryById(categoryId, database);

  if (!existedCategory) {
    return [];
  }

  let parentId = existedCategory.parentId;

  if (!parentId) {
    return [categoryId];
  }
  let categories = [categoryId, parentId];

  while (parentId) {
    const parentCategory = await Category.getCategoryById(parentId, database);
    if (!parentCategory) {
      break;
    }
    parentId = parentCategory.parentId;
    if (parentId) {
      categories.push(parentId);
    } else {
      break;
    }
  }
  return categories;
}

export const createProductAPI = async (req, res) => {
  const authUser = req.authUser;

  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to create product",
    });
  }

  const { role: isAuthRole } = authUser;
  if (isAuthRole !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to create product",
    });
  }

  const { _id: seller } = authUser;

  const existedSeller = await Seller.getProfile(seller, database);
  if (!existedSeller) {
    return res.status(400).json({
      message: "Seller not found to create product",
    });
  }

  const { title, description, price, stock, categoryId } = req.body;

  const existedCategory = await Category.getCategoryById(categoryId, database);

  if (!existedCategory) {
    return [];
  }

  let extraAttributes = {};
  for (const key in existedCategory) {
    if (
      existedCategory.hasOwnProperty(key) &&
      key !== "_id" &&
      key !== "parentId" &&
      key !== "name" &&
      key !== "admins" &&
      key !== "subCategories" &&
      key !== "__v"
    ) {
      extraAttributes[key] = existedCategory[key];
    }
  }

  try {
    let categories = [];

    if (categoryId) {
      categories = await getCategories(categoryId);
    }

    if (categories.length === 0) {
      return res.status(400).json({
        message: "Category not found to create product",
      });
    }

    const newProduct = new Product(productSchema, {
      title,
      description,
      price,
      stock,
      seller,
      categories,
    });

    await newProduct.insertProductToDatabase();
    await newProduct.updateExtraAttributes(
      newProduct._id,
      extraAttributes,
      database
    );
    const updateProduct = await Product.getProductById(
      newProduct._id,
      database
    );

    return res.status(200).json({
      message: "Product created successfully",
      product: updateProduct,
    });
  } catch (err) {
    if (err.errors) {
      const { title, description, price, stock } = err.errors;
      return res.status(400).json({
        message: "Product not created",
        title: title?.message,
        description: description?.message,
        price: price?.message,
        stock: stock?.message,
      });
    }
    return res.status(500).json({
      message: "Product not created",
      error: "Internal server error",
    });
  }
};

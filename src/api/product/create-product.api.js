import { ROLE } from "../../constants/index.js";
import { productSchema } from "../../repository/Schemas/product.schema.js";
import { Seller } from "../../models/Seller.js";
import { Product } from "../../models/Product.js";


export const createProductAPI = async (req, res) => {
  const authUser = req.authUser;
  const { role: isAuthRole } = authUser;
  const { title, price, description, categories, image, quantity } = req.body;

  if (isAuthRole !== ROLE.SELLER) {
    return res.status(401).json({
      message: "Unauthorized current user is not a seller",
    });
  }

  try {
    const product = new Product(productSchema, { title, price, description, categories, image });
  await product.insertProductToDatabase();
    return res.status(200).json({
      message: "Product created",
      product: product,
    });
  } catch (err) {
    console.log(err);
    if (err.errors) {
      const { title, price, description, categories } = err.errors;
      return res.status(400).json({
        message: "Product not created here",
        title: title?.message,
        price: price?.message,
        description: description?.message,
        categories: categories?.message,
      });
    }
    res.status(500).json({
      message: "Product not created",
      error: "Internal server error",
    });
  }
};
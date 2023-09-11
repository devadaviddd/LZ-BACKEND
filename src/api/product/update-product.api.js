import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Product } from "../../models/Product.js";
import { productSchema } from "../../repository/Schemas/product.schema.js";

export const updateProductAPI = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "Product id is required",
    });
  }

  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to update product",
    });
  }
  const { _id: sellerId, role } = authUser;
  if (role !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to update product",
    });
  }
  const { updateFields } = req.body;

  try {
    const existedProductRecord = await Product.getProductById(id, database);
    const productId = existedProductRecord._id;
    const oldProduct = new Product(productSchema, existedProductRecord);

    if (!existedProductRecord) {
      return res.status(404).json({
        message: "Product not found to update",
      });
    }

    const updateProduct = await oldProduct.updateProduct(
      productId,
      {
        title: updateFields ? updateFields.title : undefined,
        description: updateFields ? updateFields.description : undefined,
        price: updateFields ? updateFields.price : undefined,
        stock: updateFields ? updateFields.stock : undefined,
        categoryId: updateFields ? updateFields.categoryId : undefined,
        ...updateFields,
      },
      database
    );

    return res.status(200).json({
      message: "Product updated successfully",
      updateProduct,
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

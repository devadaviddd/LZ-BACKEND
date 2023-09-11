import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Cart } from "../../models/Cart.js";
import { cartSchema } from "../../repository/Schemas/cart.schema.js";

export const createCartAPI = async (req, res) => {
  const { cart } = req.body;
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to create cart",
    });
  }

  const { _id: customerId, role } = authUser;
  if (role !== ROLE.CUSTOMER) {
    return res.status(403).json({
      message: "You don't have permission to create cart",
    });
  }

  if (!cart) {
    return res.status(400).json({
      message: "Products are required",
    });
  }


  const isValidProduct = (product) => {
    if (!product.product || !product.quantity) {
      return false;
    } else {
      return true;
    }
  };

  for (const product of cart) {
    if (!isValidProduct(product)) {
      return res.status(400).json({
        message: "Product and quantity are required",
      });
    }
  }

  try {
    const cartModel = new Cart(cartSchema, cart);
    await cartModel.insertCartToDatabase(customerId);

    const newCart = await Cart.getCartByCustomerId(customerId, database);

    return res.status(200).json({
      message: "Cart created successfully",
      newCart
    });
  } catch (err) {
    console.log(err);
    if (err.errors) {
      const { product, quantity } = err.errors;
      return res.status(400).json({
        message: "Cart not created",
        product: product?.message,
        quantity: quantity?.message,
      });
    }
    return res.status(500).json({
      message: "Cart not created",
      error: "Internal server error",
    });
  }
};

import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Cart } from "../../models/cart.js";

const isValidProduct = (product) => {
  if (!product.product || !product.quantity) {
    return false;
  } else {
    return true;
  }
};

export const updateCartAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to update cart",
    });
  }

  const { _id: customerId, role } = authUser;
  if (role !== ROLE.CUSTOMER) {
    return res.status(403).json({
      message: "You don't have permission to update cart",
    });
  }

  const { cart } = req.body;

  if (!cart) {
    return res.status(400).json({
      message: "cart are required",
    });
  }

  // check if cart is {}
  // if (Object.keys(cart).length === 0) {
  //   return res.status(200).json({
  //     message: "Cart updated successfully",
  //   })
  // }

  // for (const product of cart) {
  //   if (!isValidProduct(product)) {
  //     return res.status(400).json({
  //       message: "Product and quantity are required",
  //     });
  //   }
  // }

  const existedCart = await Cart.getCartByCustomerId(customerId, database);
  if (!existedCart) {
    return res.status(400).json({
      message: "Cart not found to update",
    });
  }

  try {
    await Cart.updateCart(customerId, cart, database);
    const updatedCart = await Cart.getCartByCustomerId(customerId, database);
    return res.status(200).json({
      message: "Cart updated successfully",
      updatedCart,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

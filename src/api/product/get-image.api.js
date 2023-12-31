import { database } from "../../di/index.js";
import { Product } from "../../models/product.js";
import fs from "fs";

export const getProductImageAPI = async (req, res) => {
  const productId = req.params.id;
  try {
    const imagePath = await Product.getImagePath(productId, database);
    if (imagePath) {
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          if (err.code === "ENOENT") {
            return res.status(400).json({
              message: "File does not exist",
            });
          }
        } else {
          return res.status(200).sendFile(imagePath, { root: "." });
        }
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

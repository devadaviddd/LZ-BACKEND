import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";

export const uploadProductImageAPI = async (req, res) => {
  const authUser = req.authUser;
  const file = req.file;
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "Product id is required",
    });
  }
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to upload image",
    });
  }

  const { role } = authUser;
  if (role !== ROLE.SELLER) {
    return res.status(403).json({
      message: "You don't have permission to upload image",
    });
  }
  if (file) {
    await database.updateRecordById(id, {
      image: file.path,
    }, "products");

    return res.status(200).json({
      message: "Upload image successfully",
      image: file.path,
    });
  } else {
    return res.status(400).json({
      message: "Upload image failed",
    });
  }
};

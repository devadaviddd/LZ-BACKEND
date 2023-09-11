import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Admin } from "../../models/Admin.js";

export const getAdminProfileAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get customer",
    });
  }

  const { role, _id } = authUser;
  if (role !== ROLE.ADMIN) {
    return res.status(403).json({
      message: "You don't have permission to get admin",
    });
  }

  try {
    const admin = await Admin.getProfile(_id, database);
    if (!admin) {
      return res.status(404).json({
        message: "admin not found",
      });
    }
    return res.status(200).json({
      message: "Get admin successfully",
      admin,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

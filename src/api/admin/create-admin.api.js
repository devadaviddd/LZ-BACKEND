import { ROLE } from "../../constants/index.js";
import { adminSchema } from "../../repository/Schemas/admin.schema.js";
import { Admin } from "../../models/Admin.js";
import { User } from "../../models/User.js";
import { isEmailOrPhoneExist } from "../../utils/errors/duplicateEmailOrPhone.js";

export const createAdminAPI = async (req, res) => {
  const authUser = req.authUser;
  const { role: isAuthRole } = authUser;
  const { name, email, password } = req.body;

  if (isAuthRole !== ROLE.ADMIN) {
    return res.status(401).json({
      message: "Unauthorized current user is not admin",
    });
  }

  try {
    const admin = new Admin(adminSchema, { name, email, password });
    await admin.insertAdminToDatabase();
    return res.status(200).json({
      message: "Admin created",
      admin: admin,
    });
  } catch (err) {
    console.log(err);
    if (err.errors) {
      const { email, password, name } = err.errors;
      return res.status(400).json({
        message: "Admin not created",
        name: name?.message,
        email: email?.message,
        password: password?.message,
      });
    }
    if (err) {
      return res.status(400).json({
        message: "Admin not created",
        error: isEmailOrPhoneExist(err.message)
          ? "Email or Phone already exists"
          : err.message,
      });
    }
    res.status(500).json({
      message: "Admin not created",
      error: "Internal server error",
    });
  }
};

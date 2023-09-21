import { createAccessToken, maxAge } from "../../config/auth.config.js";
import { userSchema } from "../../repository/Schemas/user.schema.js";
import { User } from "../../models/user.js";
import { isEmailOrPhoneExist } from "../../utils/errors/duplicateEmailOrPhone.js";
import { ROLE } from "../../constants/index.js";
import { database } from "../../di/index.js";
import { Seller } from "../../models/seller.js";
import { Customer } from "../../models/customer.js";

export const signUpAPI = async (req, res) => {
  const { name, email, password, phone, businessName, address, role } =
    req.body;
  try {
    const user = new User(userSchema, {
      name,
      email,
      password,
      phone,
      role,
    });
    await user.insertUserToDatabase();

    if (role === ROLE.SELLER) {
      if (!businessName) {
        return res.status(400).json({
          message: "Business name is required",
        });
      }
      await Seller.updateSeller(
        user._id.toString(),
        {
          businessName: businessName,
        },
        database
      );
    } else if (role === ROLE.CUSTOMER) {
      if (!address) {
        return res.status(400).json({
          message: "Address is required",
        });
      }
      await Customer.updateCustomer(
        user._id.toString(),
        {
          address: address,
        },
        database
      );
    }

    const accessToken = createAccessToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    res.cookie("at", accessToken, {
      httpOnly: true,
      maxAge,
    });

    res.status(200).json({
      message: "User created successfully",
      user,
      accessToken,
    });
  } catch (err) {
    if (err.errors) {
      const { email, password, name, role } = err.errors;
      return res.status(400).json({
        message: "User not created",
        name: name?.message,
        email: email?.message,
        password: password?.message,
        role: role?.message,
      });
    }
    if (err) {
      return res.status(400).json({
        message: "User not created",
        error: isEmailOrPhoneExist(err.message)
          ? "Email or Phone already exists"
          : err.message,
      });
    }
    res.status(500).json({
      message: "User not created",
      error: "Internal server error",
    });
  }
};

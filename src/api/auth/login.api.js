import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isEmail } from "../../utils/regex/isEmail.js";
import { isPassword } from "../../utils/regex/isPassword.js";
import { isPhone } from "../../utils/regex/isPhone.js";
import { MAX_AGE } from "../../constants/index.js";
import { database } from "../../di/index.js";

export const loginAPI = async (req, res) => {
  const { email, password, phone } = req.body;
  const isHasEmailOrPhone = email || phone;
  try {
    if (!isHasEmailOrPhone || !password) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    let message = "";
    if (email && !isEmail(email)) {
      message += "Email is invalid. ";
    }

    if (phone && !isPhone(phone)) {
      message += "Phone is invalid. ";
    }

    if (!isPassword(password)) {
      message += "Password is invalid.";
    }
    if (message) {
      return res.status(400).json({
        message,
      });
    }

    const existedUserEmail = await User.findUserByEmail(email, database);
    const existedUserPhone = await User.findUserByPhone(phone, database);


    if (!existedUserEmail && !existedUserPhone) {
      return res.status(400).json({
        message: "User is not existed",
      });
    }

    const existedUser = existedUserEmail || existedUserPhone;

    const auth = await bcrypt.compare(password, existedUser.password);
    if (!auth) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    const accessToken = jwt.sign(
      { _id: existedUser._id, role: existedUser.role },
      process.env.SECRET_KEY
    );

    res.cookie("sb", accessToken, {
      httpOnly: true,
      maxAge: MAX_AGE,
    });

    res.status(200).json({
      message: "Login successfully",
      accessToken,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isEmail } from "../../utils/regex/isEmail.js";
import { isPassword } from "../../utils/regex/isPassword.js";
import { MAX_AGE } from "../../constants/index.js";

export const loginAPI = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    let message = "";
    if (!isEmail(email)) {
      message += "Email is invalid. ";
    }
    if (!isPassword(password)) {
      message += "Password is invalid.";
    }
    if (message) {
      return res.status(400).json({
        message,
      });
    }

    const existedUser = await User.findUserByEmail(email);
    if (!existedUser) {
      return res.status(400).json({
        message: "User is not existed",
      });
    }

    const auth = await bcrypt.compare(password, existedUser.password);
    if (!auth) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    const accessToken = jwt.sign(
      { _id: existedUser._id, role: existedUser.role },
      process.env.SECRET_KEY, 
    );

    res.cookie('sb', accessToken, {
      httpOnly: true,
      maxAge: MAX_AGE,
    })

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

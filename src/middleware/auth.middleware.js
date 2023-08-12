import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader);
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const accessToken = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(accessToken, process.env.SECRET_KEY);
    const { _id } = decodedToken;
    console.log("id", _id);
    if (_id) {
      const requesterId = _id;
      const user = await User.findUserById(requesterId);
      console.log("user here", user);
      user ? req.authUser = user: req.authUser = null;
    } else {
      req.authUser = null;
    }
  } else {
    req.authUser = null;
  }
  next();
};

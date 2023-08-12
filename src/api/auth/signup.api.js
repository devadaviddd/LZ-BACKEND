import { createAccessToken, maxAge } from "../../config/auth.config.js";
import { userSchema } from "../../repository/Schemas/user.schema.js";
import { User } from "../../models/User.js";
import { isEmailExist } from "../../utils/errors/duplicateEmail.js";

/**
 * @openapi
 * /auth:
 *   post:
 *     tags: [Auth]
 *     summary: Create a new user
 *     description: Use this route to create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *               role:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: johndoe@example.com
 *               password: secretPassword
 *               avatar: http://example.com/avatar.jpg
 *               role: user
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                    schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *               role:
 *                 type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
export const signUpAPI = async (req, res) => {
  const { name, email, password, avatar, role } = req.body;
  console.log(req.body);
  try {
    const user = new User(userSchema, {
      name,
      email,
      password,
      avatar,
      role,
    });
    await user.insertUserToDatabase();

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
    console.log(err);
    if (err.errors) {
      console.log("here");
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
        error: isEmailExist(err.message) ? "Email already exists" : err.message,
      });
    }
    res.status(500).json({
      message: "User not created",
      error: "Internal server error",
    });
  }
};

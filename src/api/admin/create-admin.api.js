import { adminSchema } from "../../data/Schemas/admin.schema.js";
import { Admin } from "../../models/Admin.js";
/**
 * @openapi
 * /admin/create:
 *   post:
 *     summary: Create a new admin.
 *     tags: [Admin]
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
 *     responses:
 *       200:
 *         description: Admin created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 admin:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 error:
 *                   type: object
 */
export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const admin = new Admin(adminSchema, { name, email, password });
    await admin.createAdmin();
    res.status(200).json({
      message: "Admin created",
      admin: admin,
    });
  } catch (err) {
    console.log(err);

    if (err.errors) {
      const { email, password } = err.errors;
      res.status(400).json({
        message: "Admin not created",
        email: email?.message,
        password: password?.message,
      });
    }
    res.status(400).json({
      message: "Admin not created",
      error: err,
    });
  }
};

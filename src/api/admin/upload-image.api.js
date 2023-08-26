import {ROLE} from '../../constants/index.js';

export const uploadAdminAvatar = async (req, res) => {
    const authUser = req.authUser;
    if (!authUser) {
        console.log("You are unauthorized to upload image");
        return res.status(401).json({
        message: "You are unauthorized to upload image",
      });
    }
    const { role } = authUser;
    if (role !== ROLE.ADMIN) {
      return res.status(403).json({
        message: "You don't have permission to upload image",
      });
    }
    try {
        console.log(req.body);
        console.log(req.file);
        return res.status(200).json({
        message: "Upload image successfully"
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
}
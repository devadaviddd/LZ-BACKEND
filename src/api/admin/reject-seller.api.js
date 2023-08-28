import {ROLE} from '../../constants/index.js';
import { Admin } from '../../models/Admin.js';


export const rejectSeller = async (req, res) => {
  const sellerId = req.params.sellerId;
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to reject seller",
    });
  }
  const { role } = authUser;
  if (role !== ROLE.ADMIN) {
    return res.status(403).json({
      message: "You don't have permission to reject seller",
    });
  }
  try {
    const updatedSeller = await Admin.rejectSeller(sellerId);

    if (!updatedSeller) {
      return res.status(404).json({ message: "404 Unable to Reject Seller" });
    }

    return res.status(200).json({ message: "Seller rejected", seller: updatedSeller });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
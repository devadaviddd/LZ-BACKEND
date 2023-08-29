import {ROLE} from '../../constants/index.js';
import { Admin } from '../../models/Admin.js';

export const approveSellerAPI = async (req, res) => {
  const sellerId = req.params.sellerId;
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to approve seller",
    });
  }
  const { role } = authUser;
  if (role !== ROLE.ADMIN) {
    return res.status(403).json({
      message: "You don't have permission to approve seller",
    });
  }
  try {
    const updatedSeller = await Admin.approveSeller(sellerId);

    if (!updatedSeller) {
      return res.status(404).json({ message: "404 Unable to Approve Seller" });
    }

    return res.status(200).json({ message: "Seller approved", seller: updatedSeller });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
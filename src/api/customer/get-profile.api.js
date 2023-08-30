import { ROLE } from "../../constants/index.js";
import { Customer } from "../../models/Customer.js";

export const getCustomerProfileAPI = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({
      message: "You are unauthorized to get customer",
    });
  }

  const { role, _id } = authUser;
  console.log("id", _id);
  if (role !== ROLE.CUSTOMER) {
    return res.status(403).json({
      message: "You don't have permission to get customer",
    });
  }

  try {
    const customer = await Customer.getProfile(_id);
    if (!customer) {
      return res.status(404).json({
        message: "customer not found",
      });
    }
    return res.status(200).json({
      message: "Get customer successfully",
      customer,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

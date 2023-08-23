import mongoose from "mongoose";
import { isName } from "../../utils/regex/isName.js";
import { isEmail } from "../../utils/regex/isEmail.js";
import { beforeInsertToSellers, afterInsertToSellers } from "../hooks/seller.hooks.js";
import { SELLER_STATUS } from "../../constants/sellerStatus.js";


export const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        validate: {
        validator: isName,
        message: "Name cannot over 20 characters and contain special characters",
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
        validator: isEmail,
    
        message: "Email is invalid",
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar: {
        type: String,
        default: '',
    }, 
    status:{
        type: String,
        default: SELLER_STATUS.PENDING,
    },
    product: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    order: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    }      
})

sellerSchema.pre("save", beforeInsertToSellers);
sellerSchema.post("save", afterInsertToSellers);
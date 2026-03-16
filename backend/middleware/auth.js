import jwt from "jsonwebtoken";
import adminUserModel from "../models/adminUserModel.js";

const authMiddleware = async (req,res,next) => {
    const {token} = req.headers;
    if (!token) {
        return res.json({success:false, message:"Unauthorized. Try again."});
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error in auth middleware"});
    }
}

const verifyAdmin = async (req,res,next) => {
    const {token} = req.headers;
    if (!token) {
        return res.json({success:false, message:"Unauthorized. Try again."});
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        const adminUser = await adminUserModel.findById(token_decode.id);
        
        if (!adminUser) {
            return res.json({success:false, message:"Admin user not found"});
        }
        
        if (adminUser.role !== 'admin' && adminUser.role !== 'Admin') {
            return res.json({success:false, message:"Access denied. Admin privileges required"});
        }
        
        req.adminId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error in admin verification middleware"});
    }
}

export { authMiddleware, verifyAdmin };
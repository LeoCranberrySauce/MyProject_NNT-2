import adminUserModel from "../models/adminUserModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// Login user
const adminLoginUser = async (req,res) => {
    const {userName,password} = req.body;
    try {
        const adminUser = await adminUserModel.findOne({userName})

        if(!adminUser){
            return res.json({success:false,message:"User not found"})
        }

        const isMatch = await bcrypt.compare(password,adminUser.password);
        
        if(!isMatch){
            return res.json({success:false,message:"Invalid password"})
        }

        const token = createToken(adminUser._id) 
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error logging in. Please try again."})
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// Reg user
const adminRegisterUser = async (req,res) => {
    const {name,userName,role,address,phone,email,password} = req.body;
    try {
        // check if user already exists
        const exists = await adminUserModel.findOne({email});
        if (exists){
            return res.json({success:false,message:"Admin user already exists"})
        }
        // check if email is valid
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        if (password.length < 8){
            return res.json({success:false,message:"Password must be at least 8 characters long"})
        }

        // hash user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newAdminUser = new adminUserModel({
            name:name,
            userName:userName,
            role:role,
            address:address,
            phone:phone,
            email:email,
            password:hashedPassword
        })

        const adminUser = await newAdminUser.save()
        const token = createToken(adminUser._id)
        res.json({success:true,token});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error registering user"});
    }
    
}

// all users list
const adminUsersList = async (req,res) => {
    try {
        const foods = await adminUserModel.find({});
        res.json({success:true,data:foods})
    } catch {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Verify token
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminUser = await adminUserModel.findById(decoded.id).select('-password');
        
        if (!adminUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            user: adminUser,
            role: adminUser.role
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Invalid token" });
    }
};

export {adminLoginUser, adminRegisterUser, adminUsersList, verifyToken}
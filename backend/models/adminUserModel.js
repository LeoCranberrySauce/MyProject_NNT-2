import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    userName: {type:String,required:true},
    role: {type:String},
    address: {type: String, required: true},
    phone: {type: Number, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
},{minimize: false})

const adminUserModel = mongoose.models.adminUser || mongoose.model("adminUser", adminUserSchema);
export default adminUserModel;


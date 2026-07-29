import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Food Processing"},
    currentLocation:{type:Object,default:null},
    createdAt:{type:Date,default:Date.now()},
    payment:{type:Boolean,default:false},
    promoCode:{type:Object,default:null},
    orderType:{type:String,enum:['delivery','dine-in','takeaway'],default:'delivery'},
    tableNumber:{type:Number,default:null},
    paymentMethod:{type:String,enum:['cash','card','gcash','stripe','unpaid'],default:'unpaid'},
    staffName:{type:String,default:null},
    receiptNumber:{type:String,default:null}
})

const orderModel = mongoose.model.order || mongoose.model("order",orderSchema);

export default orderModel;
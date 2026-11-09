import express from "express"
import { addFood,updatingFood,removeFood,listFood,updateStock } from "../controllers/foodController.js"
import multer from "multer"
import fs from 'fs'
import path from 'path'

// Ensure uploads directory exists before configuring multer storage
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood);
foodRouter.post("/update",upload.single("image"),updatingFood);
foodRouter.post("/remove",removeFood);
foodRouter.get("/list",listFood);
foodRouter.put("/update-stock", updateStock);



export default foodRouter;

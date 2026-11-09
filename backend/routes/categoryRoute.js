import express from "express"
import { addCategory,removeCategory,listCategory,updateCategory } from "../controllers/categoryController.js"
import multer from "multer"
import fs from 'fs'
import path from 'path'

// Ensure uploads directory exists before configuring multer storage
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const categoryRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})


categoryRouter.post("/cat-add",upload.single("image"),addCategory);
categoryRouter.post("/cat-edit",updateCategory);
categoryRouter.post("/cat-delete",removeCategory);
categoryRouter.get("/cat-list",listCategory)


export default categoryRouter;
import express from "express"
import { adminLoginUser, adminRegisterUser, adminUsersList, verifyToken } from "../controllers/adminUserController.js"

const adminUserRouter = express.Router()

adminUserRouter.post("/register", adminRegisterUser)
adminUserRouter.post("/login", adminLoginUser)
adminUserRouter.get("/verify", verifyToken)
adminUserRouter.get("/list", adminUsersList)

export default adminUserRouter;

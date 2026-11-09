import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import 'dotenv/config'
import orderRouter from "./routes/orderRoute.js"
import dashboardRouter from "./routes/dashboardRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import adminUserRouter from "./routes/adminUserRoute.js"
import locationRouter from "./routes/locationRoute.js"
import promoCodeRouter from "./routes/promoCodeRoute.js"
import tableRouter from "./routes/tableRoute.js"

import fs from 'fs'
import path from 'path'

// Ensure uploads folder exists so static file serving and Multer work correctly
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
  console.log('✅ Created "uploads" folder in backend directory')
} else {
  console.log('✅ "uploads" folder already exists')
}
import posRouter from "./routes/posRoute.js"


// app config
const app = express()
const port = process.env.PORT || 4000

// middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Allowed CORS origins - includes frontend and admin panel
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5174',
  'https://waynu-admin.onrender.com'
];
// Deduplicate while preserving order
const uniqueOrigins = [...new Set(allowedOrigins)];

app.use(cors({
  origin: uniqueOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/admin", dashboardRouter)
app.use("/api/category", categoryRouter)
app.use("/api/admin-user", adminUserRouter)
app.use("/api/location", locationRouter)
app.use("/api/promo-code", promoCodeRouter)
app.use("/api/tables", tableRouter)
app.use("/api/pos", posRouter)

// api routes
app.get("/", (req, res) => {
     res.send("API working")
});

app.listen(port, '0.0.0.0', () => {
     console.log(`Server Started on http://192.168.100.120:${port}`)
});
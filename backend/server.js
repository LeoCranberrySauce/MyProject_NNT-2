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


// app config
const app = express()
const port = 4000

// middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: function(origin, callback) {
    // Allow any origin including localhost, network IPs, and no origin (like mobile apps)
    callback(null, true);
  },
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
// api routes
app.get("/", (req, res) => {
     res.send("API working")
});

app.listen(port, '0.0.0.0', () => {
     console.log(`Server Started on http://192.168.100.120:${port}`)
});
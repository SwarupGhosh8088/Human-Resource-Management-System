import dotenv from "dotenv";
import cors from "cors"
import express from "express"
import dns from "dns"
import { connectDB } from "./Backend/modules/db.js";
import authRoutes from "./Backend/routes/auth.route.js"
import userRoutes from "./Backend/routes/user.route.js"
import attendanceRoutes from "./Backend/routes/attendance.route.js"
import leaveRoutes from "./Backend/routes/leave.route.js"
import salaryRoutes from "./Backend/routes/salary.route.js"
import documentRoutes from "./Backend/routes/document.route.js"




dns.setServers(["1.1.1.1","8.8.8.8"])
dotenv.config()
const app=express()
const PORT=process.env.PORT || 5000


//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/leave", leaveRoutes)
app.use("/api/salary", salaryRoutes)
app.use("/api/documents", documentRoutes)
app.use("/uploads", express.static("uploads"))


app.get("/",(req,res)=>{
    res.send("Welcome to the HRMS API")
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
  connectDB()
});

import express from "express";
import authcontroller from "../controllers/authcontroller.js";
const authRoutes=express.Router();
authRoutes.get("/", (req,res)=>{
res.status(200).json({m:"user created "});
})
authRoutes.post("/login", authcontroller.login);
authRoutes.post("/signup", authcontroller.signup);
authRoutes.post("/verify-email", authcontroller.verifiy_email);
authRoutes.post("/resend-otp-email", authcontroller.resend_reset_password_otp);
authRoutes.post("/social-login", authcontroller.social_login);
export default authRoutes;
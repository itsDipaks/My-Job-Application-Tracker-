import express from "express";
import authRoutes from "./authroute.js";
const allroutes=express.Router();
allroutes.use("/auth",authRoutes);
export default allroutes;
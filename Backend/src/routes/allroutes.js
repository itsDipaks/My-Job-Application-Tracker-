import express from "express";
import authRoutes from "./authroute.js";
import Jobroutes from "./jobroutes.js";
import { authmiddleware } from "../middleware/authmiddleware.js";
const allroutes = express.Router();
allroutes.use("/auth", authRoutes);
allroutes.use("/job",authmiddleware, Jobroutes);
export default allroutes;
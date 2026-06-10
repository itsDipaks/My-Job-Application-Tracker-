import express from "express";
import Myjobcontroller from "../controllers/jobcontroller.js";
import { authmiddleware } from "../middleware/authmiddleware.js";
const Jobroutes=express.Router();
Jobroutes.post("/add-job", authmiddleware, Myjobcontroller.Add_new_job);
Jobroutes.get("/get-jobs", authmiddleware, Myjobcontroller.get_all);
Jobroutes.post("/scrap-jobs-post", authmiddleware, Myjobcontroller.scrap_post);
export default Jobroutes;
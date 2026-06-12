import express, { json, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import allroutes from "./src/routes/allroutes.js";
import db from "./src/config/db.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(urlencoded());
app.use(cors());
app.use("/api", allroutes);
const PORT = process.env.PORT;
async function startServer() {
  try {
    await db.query("SELECT 1");
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`Server Started on http://localhost:${PORT}`)
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};
startServer();
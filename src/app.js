import 'dotenv/config'
import express from "express";
import connectDB from "./config/dbConnect.js"

connectDB();

const app = express();
app.use(express.json())

export default app


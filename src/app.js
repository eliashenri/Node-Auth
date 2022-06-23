import 'dotenv/config'
import express from "express";
import connectDB from "./config/dbConnect.js"
import routes from "./routes/user.js"

connectDB();

const app = express();
app.use(express.json())
routes(app);

export default app
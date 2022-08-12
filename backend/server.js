import express from "express";
import cors from "cors";
import route from "./routes/index.js";
import connectDB from "./database/index.js";

//Connect to DB
connectDB();

const app = express();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

route(app);

app.listen(5000);

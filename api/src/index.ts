require('dotenv').config();
import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

import auth_route from "./routes/auth";
const app = express();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));


app.use("/api", auth_route);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

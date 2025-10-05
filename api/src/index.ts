import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

import auth_route from "./routes/auth";
import project_route from "./routes/project-route";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Default endpoint to check API status with HTML response
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <html>
      <head>
        <title>Project Manager API</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h1>Project Manager API is running</h1>
        <p>Created By Adil Aulia Azuri</p>
      </body>
    </html>
  `);
});

app.use("/api", auth_route, project_route);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

export default app;

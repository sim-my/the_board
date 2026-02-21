import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mainRouter from "./routes/index";
import cors from "cors";
import bodyparser from "body-parser";
import morgan from "morgan";
import path from "path";

const app = express();
const PORT = 4000;



const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / curl (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),
);

// Add morgan request logging in development mode
if (process.env.NODE_ENV?.trim() === "dev") {
  app.use(morgan("dev"));
}

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../assets")));

app.get("/", (_, res) => {
  res.send("Hello from API");
});

app.use("/api", mainRouter);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

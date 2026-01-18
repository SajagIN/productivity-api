import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import taskRoutes from "./routes/taskRoutes";
import testRoutes from "./routes/testRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://sajagin.github.io",
  "https://sajagin.thedev.id",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("Blocked by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection Middleware (CRITICAL FOR VERCEL)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error in middleware:", err);
    res.status(500).json({ error: "Internal Server Error: Database Connection Failed" });
  }
});


app.get("/", (req, res) => {
  res.json({
    message: "Productivity API",
    frontend: process.env.FRONTEND_URL || "localhost only",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/test", testRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// 5. Export for Vercel
export default app;
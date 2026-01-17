import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import testRoutes from "./routes/testRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 

app.get("/", (req, res) => {
  res.json({ message: "Productivity API v" });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
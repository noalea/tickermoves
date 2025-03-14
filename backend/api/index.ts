import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pressReleaseRoutes from "./routes/pressReleaseRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import pool from "./config/db";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/press-releases", pressReleaseRoutes);
app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Database pool closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing database pool', err);
    process.exit(1);
  }
});
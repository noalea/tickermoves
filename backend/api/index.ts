import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import timeout from "connect-timeout";
import pressReleaseRoutes from "./routes/pressReleaseRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import pool from "./config/db";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(timeout("10s"));
app.use(haltOnTimedout);

// Routes
app.use("/press-releases", pressReleaseRoutes);
app.use("/notifications", notificationRoutes);

// Timeout handler function
function haltOnTimedout(req: Request, _: Response, next: NextFunction) {
  if (!req.timedout) next();
}

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
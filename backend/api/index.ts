import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pressReleaseRoutes from "./routes/pressReleaseRoutes";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/press-releases", pressReleaseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

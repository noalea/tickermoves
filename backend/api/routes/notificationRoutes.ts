import express from "express";
import { saveDeviceToken } from "../controllers/notificationController";

const router = express.Router();

router.post("/token/:token", saveDeviceToken); // Save device token

export default router;
import express from "express";
import { getPressReleases } from "../controllers/pressReleaseController";

const router = express.Router();

router.get("/", getPressReleases); // Fetch press releases

export default router;
import { Request, Response } from "express";
import { fetchPressReleases } from "../services/pressReleaseService";

export const getPressReleases = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const page = parseInt(req.query.page as string) || 1;
        const pressReleases = await fetchPressReleases(limit, page);

        res.json({
            success: true,
            ...pressReleases,
        });
    } catch (error) {
        console.error("Error fetching press releases:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
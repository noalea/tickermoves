import { Request, Response } from "express";
import { ApiResponse, PressReleasesResponse } from "@tickermoves/shared-types";
import { fetchPressReleases } from "../services/pressReleaseService";
import { validateApiKey } from "../utils";

export const getPressReleases = async (req: Request, res: Response<ApiResponse<PressReleasesResponse>>): Promise<void> => {
  if (!validateApiKey(req.query.apiKey as string, res)) {
    return;
  }
  
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const pressReleases = await fetchPressReleases(limit, page);

    res.json({
      success: true,
      data: pressReleases,
    });
    return;
  } catch (error) {
    console.error("Error fetching press releases:", error);
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};
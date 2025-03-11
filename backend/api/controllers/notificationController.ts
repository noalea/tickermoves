import { Request, Response } from "express";
import { ApiResponse, SaveDeviceTokenResponse } from "@tickermoves/shared-types";
import { storeDeviceToken } from "../services/notificationService";

export const saveDeviceToken = async (req: Request, res: Response<ApiResponse<SaveDeviceTokenResponse>>): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({success: false, message: "Token is required" });
    }
    await storeDeviceToken(token);

    res.json({ success: true, data: { token }});
  } catch (error) {
    console.error("Error fetching press releases:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
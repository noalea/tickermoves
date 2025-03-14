import { format, toZonedTime } from 'date-fns-tz';
import { estTimeZone } from '../constants'
import dotenv from 'dotenv';

import type { Response } from 'express';

dotenv.config();

export function getCurrentTimestamp(): string {
  const now = new Date();
  const estDate = toZonedTime(now, estTimeZone);
  return format(estDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: estTimeZone });
}

export function validateApiKey(apiKey: string, res: Response): boolean {
  if (apiKey !== process.env.API_KEY) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return false;
  }
  return true;
}
import pool from "../config/db";
import { getCurrentTimestamp } from "../utils";

export const storeDeviceToken = async (token: string) => {
  const query = `INSERT IGNORE INTO notification_tokens (token, created) VALUES (?, ?);`;
  const timeNow = getCurrentTimestamp();

  // Execute queries
  await pool.query(query, [token, timeNow]);
};
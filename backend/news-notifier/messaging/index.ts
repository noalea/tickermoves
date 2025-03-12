import dotenv from "dotenv";
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';
import { grabNotificationTokens } from "../db";
import { nasdaqUrl } from "../utils";

import type { ArticleAnalysis, NasdaqNews } from "../types";

dotenv.config();  

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

/**
 * Sends a push notification to multiple users.
 * @param data - Nasdaq article and analysis object.
 * @returns Promise with success or error message.
 */
export async function notifyUsers(data: NasdaqNews & ArticleAnalysis) {
  try {
    const tokens = await grabNotificationTokens();

    if (tokens?.length) {
      const tickers = data.related_symbols
        .map(item => `#${item.split('|')[0].toUpperCase()}`)
        .join(' ');

      const { url, title, created, ago, analysis, reasoning } = data;

      const message = {
        notification: { title: tickers, body: data.title },
        data: {
          url: nasdaqUrl(url),
          tickers,
          title,
          created,
          ago,
          analysis,
          reasoning
        },
        tokens,
      };
  
      const response = await admin.messaging().sendEachForMulticast(message);
  
      // Log failed tokens
      const failedTokens = tokens.filter(
        (_, index) => response.responses[index].error
      );
      if (failedTokens.length) {
        console.error('Failed tokens:', failedTokens);
      }
      return { success: true, message: 'Notifications sent successfully', failedTokens };
    }
    
    return { success: false, message: 'Failed to grab tokens from database' };

  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, message: 'Failed to send notifications', error };
  }
}


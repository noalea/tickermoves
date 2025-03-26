import puppeteer from "puppeteer";
import admin from 'firebase-admin';
import Database from "./db/database";
import { headers } from "./constants";
import { isNewRelease, recordRelease } from "./db";
import { analyzePressRelease } from "./ai";
import { nasdaqUrl, puppeteerLaunchOptions } from "./utils";
import { notifyUsers } from "./messaging";

import type { NasdaqNews } from "types";

// Job that runs every 5 minutes

// Go through nasdaq.com press releases
// Find new ones (haven't been recorded yet)
// Ask AI if likely or not to go up
// Record data
// Notify user

async function fetchLatestPressReleases(): Promise<void> {
  console.log('Memory usage at start:', process.memoryUsage());
  const db = Database.getInstance();
  let browser = null;

  try {
    const url = 'https://www.nasdaq.com/api/news/topic/press_release';
    browser = await puppeteer.launch(puppeteerLaunchOptions);
    const page = await browser.newPage();

    // Navigate to the desired web page
    await page.setUserAgent(headers["User-Agent"]);
    await page.goto(url);
    const data = await page.evaluate(() => {
      return document.body.innerText;
    });

    await browser.close();
    browser = null;

    const news: NasdaqNews[] = JSON.parse(data)?.data?.rows || [];

    for (const article of news) {
      // Skip articles without tagged tickers
      if (!article.related_symbols.length) {
        continue;
      }

      const isNewArticle = await isNewRelease(article);
      if (isNewArticle) {
        // get ai analysis
        const url = nasdaqUrl(article.url);
        const ticker = article.related_symbols[0].replace(/\|stocks/g, '');
        const analysis = await analyzePressRelease({ url, ticker });

        // add to db
        await recordRelease({ ...article, ...analysis });

        // notify user
        await notifyUsers({ ...article, ...analysis });
      }
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    // Always close browser if it's still open
    if (browser) {
      try {
        await browser.close();
      } catch (err) {
        console.error("Error closing browser:", err);
      }
    }
    
    // Always close database connection
    try {
      db.close();
    } catch (err) {
      console.error("Error closing database connection:", err);
    }
  }
}

async function cleanup() {
  try {
    // Close Firebase Admin app
    await admin.app().delete();
    console.log('Firebase Admin app closed');
  } catch (error) {
    console.error('Error closing Firebase Admin app:', error);
  }
}

fetchLatestPressReleases()
  .then(cleanup)
  .then(() => {
    console.log('Memory usage at end:', process.memoryUsage());

    // Give time for connections to close properly
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  })
  .catch(error => {
    console.error("Unhandled error:", error);
    cleanup().finally(() => {
      process.exit(1);
    });
  });

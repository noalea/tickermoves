import puppeteer from "puppeteer";
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
  try {
    const url = 'https://www.nasdaq.com/api/news/topic/press_release';
    const browser = await puppeteer.launch(puppeteerLaunchOptions);
    const page = await browser.newPage();

    // Navigate to the desired web page
    await page.setUserAgent(headers["User-Agent"]);
    await page.goto(url);
    const data = await page.evaluate(() => {
      return document.body.innerText;
    });

    await browser.close();

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
      } else {
        // do nothing
        continue;
      }
    };

    const db = Database.getInstance();
    db.close();

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchLatestPressReleases();
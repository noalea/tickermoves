import axios from "axios";
import { headers } from "./constants";
import { isNewRelease, recordRelease } from "./db";
import Database from "./db/database";

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
    const { data } = await axios.get(url, { headers });
    const news: NasdaqNews[] = data?.data?.rows || [];

    news.forEach(async article => {
      const isNewArticle = await isNewRelease(article);
      console.log('isNewArticle', isNewArticle);
      if (isNewArticle) {
        // add to db
        await recordRelease(article);
      } else {
        // do nothing
        return;
      }
    });

    // const db = Database.getInstance();
    // db.close();

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchLatestPressReleases();
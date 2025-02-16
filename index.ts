import axios from "axios";
import { headers } from "./constants/headers";
import { isNewRelease } from "./db";

import type { NasdaqNews } from "types";

// Job that runs every 5 minutes

// Go through nasdaq.com press releases
// Find new ones (haven't been recorded yet)
// Ask AI if likely or not to go up
// Record data and notify user

async function fetchLatestPressReleases(): Promise<void> {
  try {
    const url = 'https://www.nasdaq.com/api/news/topic/press_release';
    const { data } = await axios.get(url, { headers });
    const news: NasdaqNews[] = data?.data?.rows || [];

    news.forEach(async article => {
      console.log('isNewRelease', await isNewRelease(article));
    })


  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchLatestPressReleases();
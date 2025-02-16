import axios from "axios";
import { headers } from "./constants/headers";
import { createConnection } from "./db";

// Job that runs every 5 minutes

// Go through nasdaq.com press releases
// Find new ones (haven't been recorded yet)
// Ask AI if likely or not to go up
// Record data and notify user

async function fetchLatestPressReleases(): Promise<void> {
  try {
    const url = 'https://www.nasdaq.com/api/news/topic/press_release';
    const { data } = await axios.get(url, { headers });
    const news = data?.data?.rows || [];
    console.log('news', news);

    const connection = createConnection();
    console.log('connection', connection);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchLatestPressReleases();
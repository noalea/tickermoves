import axios from "axios";
import Parser from "rss-parser";

const RSS_URL: string = "https://ir.bigbear.ai/news-events/press-releases/rss";

interface FeedItem {
  title: string;
  pubDate: string;
}

async function fetchLatestNews(): Promise<void> {
  try {
    const parser: Parser = new Parser();
    const response = await axios.get(RSS_URL);
    const feed = await parser.parseString(response.data);

    const today: string = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    console.log("TODAY", today)

    feed.items.forEach((item) => {
        console.log('item', item);
      const pubDate: string = new Date((item as FeedItem).pubDate).toISOString().split("T")[0];
      console.log('pubDate', pubDate);
      if (pubDate === today) {
        console.log(`Title: ${item.title}`);
      }
    });
  } catch (error) {
    console.error("Error fetching or parsing RSS feed:", (error as Error).message);
  }
}

fetchLatestNews();
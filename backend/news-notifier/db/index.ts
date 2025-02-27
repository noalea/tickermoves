import Database from "./database";
import { getCurrentTimestamp, nasdaqUrl } from '../utils';

import type { ArticleAnalysis, ArticleRow, NasdaqNews } from "types";

export async function isNewRelease(article: NasdaqNews) {
  const db = Database.getInstance();

  try {
    const results = await db.query<ArticleRow>("SELECT * FROM releases WHERE url = ? OR title = ?", [nasdaqUrl(article.url), article.title]);
    return !results.length;

  } catch (error) {
    console.error('Database error:', error);
  }
  return false;
}

export async function recordRelease(article: NasdaqNews & (ArticleAnalysis | undefined)) {
  const db = Database.getInstance();

  try {
    const url = nasdaqUrl(article.url);
    const created = getCurrentTimestamp();
    const tickers = article.related_symbols.toString().replace(/\|stocks/g, '');
    await db.query("INSERT INTO releases (tickers, title, url, created, analysis, analysis_reasoning) VALUES (?, ?, ?, ?, ?, ?)", [tickers, article.title, url, created, article.analysis, article.reasoning]);

  } catch (error) {
    console.error('Database error:', error);
  }
}
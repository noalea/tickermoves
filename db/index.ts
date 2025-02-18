import Database from "./database";
import { nasdaqHost } from "../constants";
import { getCurrentTimestamp } from '../utils';

import type { ArticleRow, NasdaqNews } from "types";

export async function isNewRelease(article: NasdaqNews) {
  console.log('article', article);
  const db = Database.getInstance();

  try {
    const results = await db.query<ArticleRow>("SELECT * FROM releases WHERE url = ?", [article.url]);
    return !results.length;

  } catch (error) {
    console.error('Database error:', error);
  }
  return false;
}

export async function recordRelease(article: NasdaqNews) {
  const db = Database.getInstance();

  try {
    const url = `${nasdaqHost}${article.url}`;
    const created = getCurrentTimestamp();
    const tickers = article.related_symbols.toString().replace(/\|stocks/g, '');
    const id = await db.query("INSERT INTO releases (tickers, title, url, created) VALUES (?, ?, ?, ?)", [tickers, article.title, url, created]);

  } catch (error) {
    console.error('Database error:', error);
  }
}
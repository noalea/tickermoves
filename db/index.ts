import Database from "./database";

import type { NasdaqNews } from "types";

export async function isNewRelease(article: NasdaqNews) {
  console.log('article', article);
  const db = Database.getInstance();
  return true;
}
export type NasdaqNews = {
  ago: string;
  created: string;
  id: number;
  image: string;
  imagedomain: string;
  primarysymbol: string;
  primarytopic: string;
  publisher: string;
  related_symbols: string[];
  title: string;
  url: string;
}

export type ArticleRow = {
  id: number;
  tickers: string;
  title: string;
  url: string;
  created: string;
}
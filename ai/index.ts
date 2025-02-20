import OpenAI from "openai";
import dotenv from "dotenv";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { headers } from "../constants";
import { ArticleAnalysis } from "types";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Props {
  url: string;
  ticker: string;
}

export async function analyzePressRelease({ url, ticker }: Props) {
  try {
    // Fetch press release content
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error("Failed to fetch the press release");
    const text = await response.text();
    const $ = cheerio.load(text);
    const articleText = $('article').text();

    // Ask OpenAI for analysis
    const prompt = `
      Here's a press release:
      """${articleText}"""

      Do you think this press release will make the stock ${ticker} go up?
      Answer with "Most Likely", "Likely", "Unsure", or "Unlikely" and provide a short reasoning.
      Respond in the following JSON format:
      {
        "analysis": "'Most Likely', 'Likely', 'Unsure', or 'Unlikely'",
        "reasoning": "Short explanation"
      }
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are a financial analyst." }, { role: "user", content: prompt }],
      temperature: 0.5,
    });

    return JSON.parse(aiResponse?.choices[0]?.message?.content?.replace(/```json|```/g, '')?.trim() || '') as ArticleAnalysis;
  } catch (error) {
    console.error("Error analyzing press release: ", error);
    return { analysis: '' as ArticleAnalysis['analysis'], reasoning: '' };
  }
}

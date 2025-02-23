import dotenv from "dotenv";
import twilio from "twilio";
import { nasdaqUrl } from '../utils';

import type { ArticleAnalysis, NasdaqNews } from "../types";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;  
const client = twilio(accountSid, authToken);

export async function notifyUsers(data: NasdaqNews & ArticleAnalysis) {
  const tickers = data.related_symbols.map(item => `$${item.split('|')[0].toUpperCase()}`).join(', ');
  const body = `[${tickers}]\n${data.title}\n${nasdaqUrl(data.url)}\n\nWill the price go up based on the news? ${data.analysis}\n\n${data.reasoning}`;
  client.messages
    .create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.MY_PHONE_NUMBER || ''
    })
    .then(message => console.log(`Message sent! ID: ${message.sid}`))
    .catch(error => console.error(error));
}


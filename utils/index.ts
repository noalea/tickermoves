import { format, toZonedTime } from 'date-fns-tz';
import { estTimeZone, nasdaqHost } from '../constants'
import dotenv from 'dotenv';

dotenv.config();

export function getCurrentTimestamp(): string {
  const now = new Date();
  const estDate = toZonedTime(now, estTimeZone);
  return format(estDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: estTimeZone });
}

export function nasdaqUrl(url: string) {
  return `${nasdaqHost}${url}`;
}

export const isProduction = process.env.ENVIRONMENT === 'production';

export const puppeteerLaunchOptions = isProduction ? {
  executablePath: '/usr/bin/chromium-browser',
  headless: true,
  args: ['--no-sandbox']
} : undefined;
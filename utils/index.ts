import { format, toZonedTime } from 'date-fns-tz';
import { estTimeZone, nasdaqHost } from '../constants';

export function getCurrentTimestamp(): string {
  const now = new Date();
  const estDate = toZonedTime(now, estTimeZone);
  return format(estDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: estTimeZone });
}

export function nasdaqUrl(url: string) {
  return `${nasdaqHost}${url}`;
}
import { format, toZonedTime } from 'date-fns-tz';
import { estTimeZone } from '../constants';

export function getCurrentTimestamp(): string {
  const now = new Date();
  const estDate = toZonedTime(now, estTimeZone);
  return format(estDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: estTimeZone });
}
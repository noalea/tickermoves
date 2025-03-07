import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const apiUrl = 'https://tickermoves.com/api';
export const headers = {
Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export enum Analysis {
  MOST_LIKELY = 'Most Likely',
  LIKELY = 'Likely',
  UNSURE = 'Unsure',
  UNLIKELY = 'Unlikely'
}

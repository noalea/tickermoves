import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { isIOS } from '../constants';
import Notifications from '../data/notifications';

export const initNotifications = async () => {
  if (isIOS) {
    return await messaging().requestPermission();
  } else {
    return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
};

export const saveFirebaseDeviceToken = async () => {
  messaging().getToken().then(token =>
    Notifications.saveDeviceToken(token));
};

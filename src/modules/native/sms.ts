import {NativeModules} from 'react-native';
import {PermissionsAndroid} from 'react-native';

async function requestSmsPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      {
        title: 'SMS Permission',
        message: 'This app needs access to send SMS',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('SMS permission granted');
      return true;
      // Permission is granted. Proceed with SMS functionality
    } else {
      console.log('SMS permission denied');
      // Handle the case where permission is not granted
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}

async function checkForSmsPermission() {
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.SEND_SMS,
  );

  return hasPermission;
}

export const SmsModule = {
  sendSms: async (phone: string, message: string) => {
    const permissionGranted = await checkForSmsPermission();

    if (!permissionGranted) {
      return;
    }

    // TODO: Validate phone is numeric string
    return NativeModules.SmsModule.sendSms(phone, message);
  },
  checkForSmsPermission,
  requestSmsPermission,
};

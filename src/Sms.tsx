import {NativeModules} from 'react-native';

export const SmsModule = {
  sendSms: (phone: string, message: string) => {
    // TODO: Validate phone is numeric string
    NativeModules.SmsModule.sendSms(phone, message);
  },
};

import {NativeModules} from 'react-native';

export const SmsModule = {
  sendSms: async (phone: string, message: string) => {
    // TODO: Validate phone is numeric string
    return NativeModules.SmsModule.sendSms(phone, message);
  },
};

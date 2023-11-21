import {create} from 'zustand';
import {produce} from 'immer';

import {PowerModule, SmsModule} from './modules/native';

interface Store {
  state: {
    permissions: null | {
      sms: boolean;
      batteryOptimization: boolean;
    };
  };
  actions: {
    checkForPermissions: () => void;
    openBatteryOptimizationSettings: () => void;
    requestSmsPermissions: () => void;
    sendSms: (phoneNumber: string, message: string) => Promise<string>;
  };
}

export const useStore = create<Store>((set, get) => {
  const Actions = () => get().actions;

  return {
    state: {
      permissions: null,
    },
    actions: {
      checkForPermissions: async () => {
        const isSmsPermissionGranted = await SmsModule.checkForSmsPermission();
        const isBatteryOptEnabled = await PowerModule.isBatteryOptEnabled();

        set(state =>
          produce(state, draft => {
            draft.state.permissions = {
              sms: isSmsPermissionGranted,
              batteryOptimization: isBatteryOptEnabled,
            };
          }),
        );
      },
      openBatteryOptimizationSettings: async () => {
        await PowerModule.openBatteryOptimizationSettings();
        Actions().checkForPermissions();
      },
      requestSmsPermissions: async () => {
        await SmsModule.requestSmsPermission();
        Actions().checkForPermissions();
      },
      sendSms: async (phoneNumber, message) => {
        return SmsModule.sendSms(phoneNumber, message);
      },
    },
  };
});

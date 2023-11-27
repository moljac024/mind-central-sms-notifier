import {create} from 'zustand';
import {produce} from 'immer';

import {PowerModule, SmsModule} from './modules/native';
import {sendPendingAppointmentReminders} from './tasks';

interface Store {
  state: {
    permissions: null | {
      sms: boolean;
      batteryOptimization: boolean;
    };
    inProgress: boolean;
    popup?: string;
  };
  actions: {
    checkForPermissions: () => void;
    openBatteryOptimizationSettings: () => void;
    requestSmsPermissions: () => void;
    sendSms: (phoneNumber: string, message: string) => Promise<string>;
    clearPopup: () => void;
    sendPendingAppointmentReminders: (props: {
      signal?: AbortSignal;
    }) => Promise<void>;
  };
}

export const useStore = create<Store>((set, get) => {
  const Actions = () => get().actions;

  return {
    state: {
      permissions: null,
      inProgress: false,
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
      clearPopup: () => {
        set(state =>
          produce(state, draft => {
            draft.state.popup = undefined;
          }),
        );
      },
      sendPendingAppointmentReminders: async (
        props: {
          signal?: AbortSignal;
        } = {},
      ) => {
        set(state =>
          produce(state, draft => {
            draft.state.popup = undefined;
            draft.state.inProgress = true;
          }),
        );

        try {
          await sendPendingAppointmentReminders({signal: props.signal});

          set(state =>
            produce(state, draft => {
              draft.state.popup = 'Sent messages successfully!';
            }),
          );
        } catch (error) {
          // TODO: Handle error
        } finally {
          set(state =>
            produce(state, draft => {
              draft.state.inProgress = false;
            }),
          );
        }
      },
    },
  };
});

import {create} from 'zustand';
import {produce} from 'immer';

import {DB} from './db';

import {PowerModule, SmsModule, VersionModule, VersionInfo} from './native';
import {sendPendingAppointmentReminders} from './appointments';

export interface Store {
  state: {
    initialized: boolean;
    permissions: null | {
      sms: boolean;
      batteryOptimization: boolean;
    };
    version: null | VersionInfo;
    inProgress: boolean;
    popup?: string;
  };
  actions: {
    init: () => Promise<void>;
    checkForPermissions: () => Promise<void>;
    checkVersion: () => Promise<void>;
    openBatteryOptimizationSettings: () => Promise<void>;
    requestSmsPermissions: () => Promise<void>;
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
      initialized: false,
      permissions: null,
      version: null,
      inProgress: false,
      popup: undefined,
    },
    actions: {
      init: async () => {
        const initialized = get().state.initialized;
        if (initialized) {
          console.log('Attempted to initialize app twice!');
          return;
        }

        console.log('Initializing app...');

        // Initialize the database
        await DB.initializeDatabase();

        // Run initial actions
        await Actions().checkVersion();
        await Actions().checkForPermissions();

        set(state =>
          produce(state, draft => {
            draft.state.initialized = true;
          }),
        );
        console.log('App initialized.');
      },
      checkVersion: async () => {
        const version = await VersionModule.getVersion();

        set(state =>
          produce(state, draft => {
            draft.state.version = version;
          }),
        );
      },
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

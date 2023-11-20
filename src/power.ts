import {NativeModules} from 'react-native';

export const PowerModule = {
  isBatteryOptEnabled: async function (): Promise<boolean> {
    const result = await NativeModules.PowerModule.isBatteryOptEnabled();
    return result;
  },
  openBatteryOptimizationSettings: async function (): Promise<void> {
    return NativeModules.PowerModule.openBatteryOptimizationSettings();
  },
};

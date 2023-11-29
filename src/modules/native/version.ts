import {Platform, NativeModules} from 'react-native';

export type VersionInfo =
  | {
      os: 'android';
      versionCode: number;
      versionName: string;
    }
  | {
      os: 'ios';
      versionName: string;
    };

export const VersionModule = {
  getVersion: async function (): Promise<VersionInfo> {
    const os = Platform.OS;

    if (['ios', 'android'].includes(os) === false) {
      throw new Error('Unsupported platform: ' + os);
    }

    const result = await NativeModules.VersionModule.getVersion();
    return {os, ...result};
  },
};

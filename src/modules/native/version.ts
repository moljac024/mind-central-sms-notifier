import {NativeModules} from 'react-native';

export const VersionModule = {
  getVersion: async function (): Promise<string> {
    const result = await NativeModules.VersionModule.getVersion();
    return result;
  },
};

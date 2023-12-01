// import {DB} from './db';

type Preferences = {
  isDarkMode: boolean;
};

type IPreferencesService = {
  getPreferences: () => Promise<Preferences>;
  setPreferences: (preferences: Preferences) => Promise<void>;
};

export const PreferencesService: IPreferencesService = {
  getPreferences: async () => {
    const defaultPreferences: Preferences = {
      isDarkMode: false,
    };

    // TODO: Fetch preferences from the DB
    // const preferences = await DB.getDatabase().executeAsync(
    //   'SELECT * FROM Preferences',
    // );

    return defaultPreferences;
  },
  setPreferences: async (preferences: Preferences) => {
    // TODO: Implement
    console.log('setting prefs:', preferences);
  },
};
